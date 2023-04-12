import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './profile.model';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.${process.env.NODE_ENV}.env`
    }),
    // ClientsModule.register([
    //   {
    //     name: 'PROFILE_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_URL],
    //       queue: 'controller_queue',
    //       queueOptions: {
    //         durable: false
    //       },
    //     },
    //   },
    // ]),
    SequelizeModule.forFeature([Profile]),
  ],
  exports: [
    ProfileService
  ]
})
export class ProfileModule {} 
