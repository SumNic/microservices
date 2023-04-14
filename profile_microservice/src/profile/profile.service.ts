import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profil.dto';
import { Profile } from './profile.model';
import * as bcrypt from 'bcryptjs'; 
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProfileService {

    constructor(
        @InjectModel(Profile) 
            private profileRepository: typeof Profile,
                        ) {}

    async createUser(dto: CreateProfileDto) {
        const profile = await this.profileRepository.create(dto);
        return profile;
    }

    async getAllUsers() { 
        const users = await this.profileRepository.findAll({include: {all: true}});
        return users;
    } 

    async updateProfile(editDto: CreateProfileDto, id: number) {
        const profile = await this.profileRepository.findByPk(id);
        if(!profile) {
            throw new RpcException('Указанный профиль не существует');
        }
        await profile.update({...editDto});
        return profile;
    }

    async getOneProfileById(id: number) { 
        const profile = await this.profileRepository.findOne({where: {id}, include: {all: true}});
        return profile;
    }

    async removeProfile(id: number) {
        const profile = await this.profileRepository.findByPk(id);
        if(!profile) {
            return new RpcException('Указанный пользователь не существует');
        }
        await profile.destroy();
        return profile;
    }
}