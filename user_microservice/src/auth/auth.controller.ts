import { Controller, HttpException, HttpStatus, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './auth.model';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
        @Inject('USER_SERVICE') private client: ClientProxy
        ) {}

    @MessagePattern('registration')
    async handleUserCreated(@Payload() dto: CreateUserDto): Promise<CreateUserDto | any> {
        const user = this.authService.registration(dto);
        const userId =(await user).id
        this.client.emit('profile', {...dto, userId: userId});
        return user;
    }

    @MessagePattern('login')
    async handleUserAuth(@Payload() dto: CreateUserDto): Promise<{token: string}> {
        return this.authService.login(dto);
    }
    
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
            throw new RpcException('Произошла ошибка при редактировании профиля');
        }
        const profile = this.client.send('updateUser', editDto);
        return profile;
    }

    @MessagePattern('remove')
    async remove(@Payload() id: number): Promise<any> {
        const user = this.authService.removeUser(id);
        if(!user) {
            throw new RpcException('Произошла ошибка при редактировании профиля');
        }
        const profile = this.client.send('remove', id);
        return profile;
    }

     
}
