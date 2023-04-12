import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profil.dto';
import { Profile } from './profile.model';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(Profile) 
            private profileRepository: typeof Profile,
        // @InjectModel(User) 
        //     private userRepository: typeof User,
            // private roleService: RolesService,
                        ) {}

    async createUser(dto: CreateProfileDto) {
        const profile = await this.profileRepository.create(dto);
        return profile;
    }

    // async getOneUsers(email: string) { 
    //     const users = await this.userRepository.findOne({where: {email}, include: {all: true}});
    //     return users;
    // }

    // async getOneUsersById(id: number) { 
    //     const users = await this.userRepository.findOne({where: {id}, include: {all: true}});
    //     return users;
    // }

    // async getAllUsers() { 
    //     const users = await this.userRepository.findAll({include: {all: true}});
    //     return users;
    // } 

    // async updateUser(id: number, editDto: CreateProfileDto) {
    //     console.log(editDto)
    //     const candidate = await this.getOneUsers(editDto.email);
        
    //     // Проверка, чтобы меняемый email не совпадал с email уже существующих пользователей,
    //     // то есть этот email может быть только у редактируемого пользователя
    //     if(candidate && candidate.id !== +id) {
    //         throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    //     }
    //     const user = await this.userRepository.findByPk(id);
    //     const profile = await this.profileRepository.findByPk(id);
    //     const hashPassword = await bcrypt.hash(editDto.password, 5);
    //     await user.update({...editDto, password: hashPassword});
    //     await profile.update({...editDto});
    //     return user;
    // }

    // async updateOneUser(req: any, editDto: CreateProfileDto) {
    //     const id = req.user.id;
    //     const candidate = await this.authService.getUserByEmail(editDto.email);
    //     // Проверка, чтобы меняемый email не совпадал с email уже существующих пользователей,
    //     // то есть этот email может быть только у редактируемого пользователя
    //     if(candidate && candidate.id !== +id) {
    //         throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    //     }
    //     const user = await this.userRepository.findByPk(id);
    //     const profile = await this.profileRepository.findByPk(id);
    //     const hashPassword = await bcrypt.hash(editDto.password, 5);
    //     await user.update({...editDto, password: hashPassword});
    //     await profile.update({...editDto});
    //     return user;
    // }

    // async removeUser(id: number) {
    //     const user = await this.userRepository.findByPk(id);
    //     if(!user) {
    //         throw new HttpException('Указанный пользователь не существует', HttpStatus.BAD_REQUEST);
    //     }
    //     const profile = await this.profileRepository.findByPk(id);
    //     // Удалить текущий файл с сервера и базы данных
    //     await this.fileService.deleteFile(profile.essenceTable, id);
    //     // Удаляем пользователя из таблицы users и profile
    //     await user.destroy();
    //     await profile.destroy();
    //     return 'Пользователь успешно уделён!';
    // }

    // async removeOneUser(req: any) {
    //     const id = req.user.id;
    //     const user = await this.userRepository.findByPk(id);
    //     if(!user) {
    //         throw new HttpException('Указанный пользователь не существует', HttpStatus.BAD_REQUEST);
    //     }
    //     const profile = await this.profileRepository.findByPk(id);
    //     console.log(profile.essenceTable)
    //     console.log(id)
    //     await this.fileService.deleteFile(profile.essenceTable, id);
    //     // Удаляем пользователя из таблицы users и profile
    //     await user.destroy();
    //     await profile.destroy();
    //     return 'Ваша страница удалена!';
    // }
}