import { Body, Controller, Get, Inject, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from './roles-auth.decorator';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('CONTROLLER_SERVICE') private client: ClientProxy) {}

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200})
  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
    registration(@Body() dto) {
      return this.client.send('registration', dto);
  }

  @ApiOperation({summary: 'Ауторизация пользователя'})
  @ApiResponse({status: 200, description: 'Token'})
  @Post('/login')
  @UseInterceptors(FileInterceptor('image'))
    auth(@Body() dto) {
      return this.client.send('login', dto);
  }

  @ApiOperation({summary: 'Получить одного пользователя по Id'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @UseInterceptors(FileInterceptor('image')) 
  getOneUser(@Param('id') id: number): Observable<any> {
      return this.client.send('getOneUser', id); 
  }

  @ApiOperation({summary: 'Получить всех пользователей'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
      // return this.profileService.getAllUsers();
      return this.client.send('getOneUser', id);
  }

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

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({summary: 'Создание новой роли'})
  @ApiResponse({status: 200})
  @Post('/roles')
  create(@Body() dto) {
      return this.client.send('roles', dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({summary: 'Получение роли по её id'})
  @ApiResponse({status: 200})
  @Get('/roles/:value')
  getByValue(@Param('value') value: string) {
      return this.client.send('rolesById', value);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({summary: 'Назначение роли пользователю'})
  @ApiResponse({status: 200}) 
  @Post('/roles/role')
  addRole(@Body() dto) {
      return this.client.send('roleUser', dto);
  }
}

