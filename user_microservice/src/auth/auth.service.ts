import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; 
import { User } from './auth.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private jwtService: JwtService,
        private roleService: RolesService,
        ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    async registration(dto: CreateUserDto): Promise<CreateUserDto | any> {
        const candidate = await this.getUserByEmail(dto.email);
        if(candidate) {
            return new RpcException('Пользователь с таким email существует')
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.create({...dto, password: hashPassword});
        const role = await this.roleService.getRoleByValue("USER");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        await this.generateToken(user);
        return user; 
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: this.jwtService.sign(payload) 
        }
    }

    private async validateUser(userDto: CreateUserDto): Promise<CreateUserDto | any> {
        const user = await this.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        return new UnauthorizedException({message: 'Некорректный email или пароль'})
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
            return new RpcException('Пользователь с таким email существует');
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
