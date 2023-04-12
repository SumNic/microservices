import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateRoleDto } from './dto/create-roles.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from './roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './roles.model';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Роли пользователей')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    // @ApiOperation({summary: 'Создание новой роли'})
    // @ApiResponse({status: 200, type: Role})
    // @Post()
    // create(@Body() dto: CreateRoleDto) {
    //     return this.roleService.createRole(dto);
    // }

    @MessagePattern('roles')
    async create(@Payload() dto: CreateRoleDto): Promise<CreateRoleDto> {
        return this.roleService.createRole(dto);
    }

    // @ApiOperation({summary: 'Получение роли по её id'})
    // @ApiResponse({status: 200, type: Role})
    // @Get('/:value')
    // getByValue(@Param('value') value: string) {
    //     return this.roleService.getRoleByValue(value);
    // }

    @MessagePattern('rolesById')
    async getByValue(@Payload() value: string): Promise<CreateRoleDto> {
        return this.roleService.getRoleByValue(value);
    }

    // @ApiOperation({summary: 'Назначение роли пользователю'})
    // @ApiResponse({status: 200, type: Role}) 
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    // @Post('/role')
    // addRole(@Body() dto: AddRoleDto) {
    //     return this.roleService.addRole(dto);
    // }

    @MessagePattern('roleUser')
    async addRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
        return this.roleService.addRole(dto);
    }

    

}

// @ApiOperation({summary: 'Создание новой роли'})
//     @ApiResponse({status: 200})
//     @Post('/roles')
//     create(@Body() dto) {
//         // return this.roleService.createRole(dto);
//         return this.client.send('roles', dto);
//     }

//     @ApiOperation({summary: 'Получение роли по её id'})
//     @ApiResponse({status: 200})
//     @Get('/roles/:value')
//     getByValue(@Param('value') value: string) {
//         // return this.roleService.getRoleByValue(value);
//         return this.client.send('rolesById', value);
//     }

//     @ApiOperation({summary: 'Назначение роли пользователю'})
//     @ApiResponse({status: 200}) 
//     @Post('/roles/role')
//     addRole(@Body() dto) {
//         // return this.roleService.addRole(dto);
//         return this.client.send('roleUser', dto);
//     }