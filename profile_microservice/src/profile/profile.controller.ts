import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateProfileDto } from './dto/create-profil.dto';
import { ProfileService } from './profile.service';

@ApiTags('Пользователи')
@Controller()
export class ProfileController {

    constructor(
        private profileService: ProfileService,
        ) {}

    @EventPattern('profile')
    async handleUserCreated(dto: CreateProfileDto) {
        return this.profileService.createUser(dto);
    }

    @MessagePattern('getAllUsers')
    async getAll(@Payload() get: number) {
        return this.profileService.getAllUsers();
    }

    @MessagePattern('updateUser')
    async updateProfile(@Payload() editDto: CreateProfileDto, @Payload('id') id: number): Promise<any> {
        return this.profileService.updateProfile(editDto, id);
    }

    @MessagePattern('remove')
    async removeProfileById(@Payload() id: number): Promise<any> {
        return this.profileService.removeProfile(id);
    }
}
