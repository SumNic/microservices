import { Controller, Inject, Post, Res, UseInterceptors, } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
        @Inject('USER_SERVICE') private client: ClientProxy
        ) {}

    @MessagePattern('registration')
    async handleUserCreated(@Payload() dto: CreateUserDto) {
        const userData = await this.authService.registration(dto);
        return userData;
    }

    @MessagePattern('login')
    async handleUserAuth(@Payload() dto: CreateUserDto): Promise<{ accessToken: string; refreshToken: string; }> {
        return this.authService.login(dto);
    }

    @MessagePattern('logout')
    async handleUserAutput(@Payload() refreshToken: string): Promise<number> {
        return this.authService.logout(refreshToken);
    }

    @MessagePattern('activate')
    async handleUserActivate(@Payload() activationLink: string) {
        return this.authService.activate(activationLink);
    }

    @MessagePattern('refresh')
    async handleUserRefresh(@Payload() refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }
    // : Promise<{token: string}>
    
    @MessagePattern('getOneUser')
    async getOneUser(@Payload() id: number) {
        return this.authService.getOneUsersById(id);
    }

    @MessagePattern('getAllUsers')
    async getAllUser(@Payload() get: number): Promise<any> {
        const user = this.client.send('getAllUsers', get);
        return user;
    }

    @MessagePattern('updateUser')
    async updateUser(@Payload() editDto: CreateUserDto, @Payload('id') id: number): Promise<any> {
        const user = this.authService.updateUser(editDto, id);
        if(!user) {
            return new RpcException('Произошла ошибка при редактировании профиля');
        }
        const profile = this.client.send('updateUser', editDto);
        return profile;
    }

    @MessagePattern('remove')
    async remove(@Payload() id: number): Promise<any> {
        const user = this.authService.removeUser(id);
        if(!user) {
            return new RpcException('Произошла ошибка при редактировании профиля');
        }
        const profile = this.client.send('remove', id);
        return profile;
    }

     
}
