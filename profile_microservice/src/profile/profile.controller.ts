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
        // @Inject('PROFILE_SERVICE') private client: ClientProxy
        ) {}

    @EventPattern('profile')
    async handleUserCreated(dto: CreateProfileDto) {
        return this.profileService.createUser(dto);
    }

    // @MessagePattern('getOneUser')
    // async getOneUser(dto: CreateProfileDto) {
    //     return this.profileService.createUser(dto);
    // }

    // @ApiOperation({summary: 'Ауторизация пользователя'})
    // @ApiResponse({status: 200, description: 'Token'})
    // @Post('/login')
    // @UseInterceptors(FileInterceptor('image'))
    // login(@Body() dto: CreateUserDto) {
    //     return this.authService.login(dto);
    // }

    // @ApiOperation({summary: 'Получить одного пользователя по Id'})
    // @ApiResponse({status: 200, type: User})
    // @UseGuards(JwtAuthGuard)
    // @Get('/:id')
    // getOneUser(@Param('id') id: number) {
    //     return this.profileService.getOneUsersById(id);
    // }

    // @ApiOperation({summary: 'Получить всех пользователей'})
    // @ApiResponse({status: 200, type: [User]})
    // @UseGuards(JwtAuthGuard)
    // @Get()
    // getAll() {
    //     return this.profileService.getAllUsers();
    // }

    // @ApiOperation({summary: 'Редактирование профиля пользователя (для админа)'})
    // @ApiResponse({status: 200, type: User})
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    // @Put('/update/:id')
    // @UseInterceptors(FileInterceptor('image'))
    // update(@Param('id') id: number, @Body() editDto: CreateProfileDto) {
    //     return this.profileService.updateUser(id, editDto);
    // }

    // @ApiOperation({summary: 'Редактирование своего профиля (для пользователя)'})
    // @ApiResponse({status: 200, type: User})
    // @UseGuards(JwtAuthGuard)
    // @Put('/update')
    // @UseInterceptors(FileInterceptor('image'))
    // updateSelf(@Req() req: any, @Body() editDto: CreateProfileDto) {
    //     return this.profileService.updateOneUser(req, editDto);
    // }

    // @ApiOperation({summary: 'Удаление пользователя (для админа)'})
    // @ApiResponse({status: 200, description: 'Пользователь успешно удален!'})
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    // @Delete('/delete/:id')
    // @UseInterceptors(FileInterceptor('image'))
    // remove(@Param('id') id: number) {
    // return this.profileService.removeUser(+id);
    // }

    // @ApiOperation({summary: 'Удаление своего профиля (для пользователя)'})
    // @ApiResponse({status: 200, description: 'Ваша станица удалена!'})
    // @UseGuards(JwtAuthGuard)
    // @Delete('/delete')
    // @UseInterceptors(FileInterceptor('image'))
    // removeSelf(@Req() req: any) {
    // return this.profileService.removeOneUser(req);
    // }
}
