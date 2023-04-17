import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; 
import * as uuid from 'uuid'; 
import { User } from './auth.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RolesService } from 'src/roles/roles.service';
import { mainModule } from 'process';
import { ConfigService } from '@nestjs/config';
import { Token } from './token.model';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private jwtService: JwtService,
        private mailService: MailService,
        private roleService: RolesService,
        private configService: ConfigService,
        @InjectModel(Token) private tokenRepository: typeof Token,
        @Inject('USER_SERVICE') private client: ClientProxy
        ) {}

    async login(userDto: CreateUserDto): Promise<CreateUserDto | any> {
        const user = await this.validateUser(userDto);
        if (user instanceof Error) {
            return {error: user.message};
        }
        const tokens = await this.generateToken(user);
        await this.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user};
    }

    async logout(refreshToken: string): Promise<number> {
        const tokenData = await this.tokenRepository.destroy({where: {refreshToken}});
        return tokenData;
    }

    async refresh(refreshToken: string): Promise<{token: string} | any> {
        if (!refreshToken) {
            return {error: new RpcException('Ошибка авторизации').message}
        }
        const userData = await this.validateAccessToken(refreshToken);
        const tokenFromDb = await this.tokenRepository.findOne({where: {refreshToken}});
        if (!userData || !tokenFromDb) {
            return {error: new RpcException('Ошибка авторизации').message}
        }
    }

    validateAccessToken(token: string) {
        try{
            const userData = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET});
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try{
            const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
            return userData;
        } catch (e) {
            return null;
        }
    }

    async registration(dto: CreateUserDto): Promise<CreateUserDto | any> {
            const candidate = await this.getUserByEmail(dto.email);
            if(candidate) {
                return {error: new RpcException('Пользователь с таким email существует').message}
            }
            const hashPassword = await bcrypt.hash(dto.password, 5);
            const activationLink = uuid.v4();
            const user = await this.userRepository.create({...dto, password: hashPassword, activationLink});
            const role = await this.roleService.getRoleByValue("ADMIN");
            await user.$set('roles', [role.id]);
            user.roles = [role];
            this.client.emit('profile', {...dto, userId: user.id});
            
            await this.mailService.sendUserConfirmation(dto.email, activationLink);
            const tokens = await this.generateToken(user);
            await this.saveToken(user.id, tokens.refreshToken);
            return {...tokens, user};
        }

    async activate(activationLink: string) {
        const user = await this.userRepository.findOne({where: {activationLink}, include: {all: true}});
        if(!user) {
            return {error: new RpcException('Пользователь с таким email существует').message}
        }
        user.isActivated = true;
        await user.save();
    }

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.sign(
            {
                payload
            },
            {
              secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
              expiresIn: '15m',
            },
          ),
          this.jwtService.sign(
            {
                payload
            },
            {
              secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
              expiresIn: '7d',
            },
          ),
        ]);
        
        return {
            accessToken,
            refreshToken,
        };      
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({where: {userId}, include: {all: true}});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokenRepository.create({userId: userId, refreshToken});
        return token;
    }
    

    private async validateUser(userDto: CreateUserDto): Promise<CreateUserDto | any> {
        try {
        const user = await this.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
    } catch {
        return new RpcException('Некорректный email или пароль');
    }
        
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    async getOneUsersById(id: number) { 
        const users = await this.userRepository.findOne({where: {id}, include: {all: true}});
        return users;
    }

    async updateUser(editDto: CreateUserDto, id: number) {
            const candidate = await this.getUserByEmail(editDto.email);
        // Проверка, чтобы меняемый email не совпадал с email уже существующих пользователей,
        // то есть этот email может быть только у редактируемого пользователя
        if(candidate && candidate.id !== +id) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findByPk(id);
        const hashPassword = await bcrypt.hash(editDto.password, 5);
        await user.update({...editDto, password: hashPassword});
        return user;
    }

    async removeUser(id: number) {
        const user = await this.userRepository.findByPk(id);
        if(!user) {
            return new RpcException('Указанный пользователь не существует');
        }
        await user.destroy();
        return user;
    }
}
