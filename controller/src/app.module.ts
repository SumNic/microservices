import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

console.log(process.cwd())

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.${process.env.NODE_ENV}.env`
    }),
    ClientsModule.register([
      {
        name: 'CONTROLLER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: 'controller_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  exports: [
    JwtModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
