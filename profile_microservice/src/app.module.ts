import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/profile.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.${process.env.NODE_ENV}.env`
    }),
    // ConfigModule.forRoot({
    //   envFilePath: `.${process.env.NODE_ENV}.env`
    // }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWOR,
      database: process.env.POSTGRES_DB,
      models: [Profile],
      synchronize: true,
      autoLoadModels: true
    }),
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
