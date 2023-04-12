import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/auth.model';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateRoleDto } from './dto/create-roles.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
        @InjectModel(User) private userRepository: typeof User,
    ) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new RpcException('Пользователь или роль не найдены');
    }
}
