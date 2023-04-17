import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, activationLink: string) {
    const url = `${process.env.API_URL}/user/activate/${activationLink}`;

    await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_USER, // override default from
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: `${url}`,
      html: 
        `
            <div>
                <h1>Для активации перейдите по ссылке </h1>
                <a href=${url} rel="nofollow noopener noreferrer">${url}</a>
            </div>
        `
        // <a href="${url}" rel="nofollow noopener noreferrer">activationLink</a>
    //   template: './confirmation', // `.hbs` extension is appended automatically
    //   context: { // ✏️ filling curly brackets with content
    //     name: user.name,
    //     url,
    //   },
    });
  }
}
