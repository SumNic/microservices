import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
// import { Roles } from 'src/auth/roles-auth.decorator';
// import { RolesGuard } from 'src/auth/roles.guard';
import { CreateRoleDto } from './dto/create-roles.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from './roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Role } from './roles.model';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Роли пользователей')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @MessagePattern('roles')
    async create(@Payload() dto: CreateRoleDto): Promise<CreateRoleDto> {
        return this.roleService.createRole(dto);
    }

    @MessagePattern('rolesById')
    async getByValue(@Payload() value: string): Promise<CreateRoleDto> {
        return this.roleService.getRoleByValue(value);
    }

    @MessagePattern('roleUser')
    async addRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
        return this.roleService.addRole(dto);
    }
}