import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles-auth.decorator';
import { AppService } from './app.service';
import { AnySrvRecord } from 'dns';
import { Request, Response } from 'express';


@ApiTags('Общий')
@Controller('user')
export class AppController {
  constructor(
    @Inject('CONTROLLER_SERVICE') private client: ClientProxy,
    private appService: AppService,) {}

  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200})
  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
    async registration(@Body() dto, @Res({ passthrough: true }) res: Response ) {
      return this.client.send('registration', dto)
      .pipe(
        map(elem => {
          res.cookie('refreshToken', elem.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
          return elem;
        })
      );
  }

  @ApiOperation({summary: 'Ауторизация пользователя'})
  @ApiResponse({status: 200, description: 'Token'})
  @Post('/login')
  @UseInterceptors(FileInterceptor('image'))
    auth(@Body() dto, @Res({ passthrough: true }) res: Response ) {
      return this.client.send('login', dto)
      .pipe(
        map(elem => {
          res.cookie('refreshToken', elem.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
          return elem;
        })
      );
  }

  // Выход из профиля
  @ApiOperation({summary: 'Выход из профиля'})
  @ApiResponse({status: 200, description: 'Удаление Token'})
  @Post('/logout')
  @UseInterceptors(FileInterceptor('image'))
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response ) {
    const {refreshToken} = req.cookies;
    return this.client.send('logout', refreshToken)
    .pipe(
      map(elem => {
        res.clearCookie('refreshToken')
        return elem.token;
      })
    );
  }

  // Refresh токен 
  @ApiOperation({summary: 'Обновление токена'})
  @ApiResponse({status: 200, description: 'Обновление токена'})
  @Get('/refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response ) {
    const {refreshToken} = req.cookies;
    return this.client.send('refresh', refreshToken)
    .pipe(
      map(elem => {
        res.cookie('refreshToken', elem.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
          return elem;
      })
    );
}

  // Активация аккаунта
  @ApiOperation({summary: 'Активация аккаунта'})
  @ApiResponse({status: 200, description: 'Ссылка для активации'})
  @Get('/activate/:link')
  activate(@Param('link') activationLink: string, @Res() res: any) {    
    res.redirect(process.env.CLIENT_URL);
    return this.client.send('activate', activationLink);
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

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
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

