import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy, Ctx, RmqContext } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles-auth.decorator';

@ApiTags('Общий')
@Controller('user')
export class AppController {
  constructor(@Inject('CONTROLLER_SERVICE') private client: ClientProxy) {}

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
      const get = 1;
      return this.client.send('getAllUsers', get);
  }

  @ApiOperation({summary: 'Редактирование профиля пользователя (для админа)'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: number, @Body() editDto) {
    return this.client.send('updateUser', {...editDto, id});
  }

  @ApiOperation({summary: 'Редактирование своего профиля (для пользователя)'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Put('/update')
  @UseInterceptors(FileInterceptor('image'))
  updateSelf(@Req() req: any, @Body() editDto) {
    const id = req.user.id;
      return this.client.send('updateUser', {...editDto, id});
  }

  @ApiOperation({summary: 'Удаление пользователя (для админа)'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete('/delete/:id')
  @UseInterceptors(FileInterceptor('image'))
  remove(@Param('id') id: number) {
  return this.client.send('remove', +id);
  }

  @ApiOperation({summary: 'Удаление своего профиля (для пользователя)'})
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  @UseInterceptors(FileInterceptor('image'))
  removeSelf(@Req() req: any) {
    const id = req.user.id;
      return this.client.send('remove', id);
  }

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

