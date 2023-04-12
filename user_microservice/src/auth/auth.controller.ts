import { Controller, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
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
    async handleUserCreated(@Payload() dto: CreateUserDto): Promise<CreateUserDto> {
        const user = this.authService.registration(dto);
        const userId =(await user).id
        this.client.emit('profile', {...dto, userId: userId});
        return user;
    }

    @MessagePattern('login')
    async handleUserAuth(@Payload() dto: CreateUserDto, @Ctx() context: RmqContext): Promise<{token: string}> {
        console.log(context.getMessage())
        return this.authService.login(dto);
    }
    
    @MessagePattern('getOneUser')
    async getOneUser(@Payload() id: number) {
        return this.authService.getOneUsersById(id);
    }

     
}
