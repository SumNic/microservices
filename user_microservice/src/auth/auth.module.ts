import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './auth.model';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

@Module({
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.${process.env.NODE_ENV}.env`
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: 'user_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    SequelizeModule.forFeature([Role, User, UserRoles]),
    forwardRef(() => RolesModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  
  exports: [
    AuthService,
    JwtModule
  ],
  
  controllers: [AuthController]
})
export class AuthModule {}
