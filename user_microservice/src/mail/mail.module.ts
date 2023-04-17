import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.${process.env.NODE_ENV}.env`
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
  ],

  exports: [
    MailService
  ],
})
export class MailModule {}
