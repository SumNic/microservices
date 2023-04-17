import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
    constructor(@Inject('CONTROLLER_SERVICE') private client: ClientProxy,) {}

    async reg(dto) {
        return this.client.send('registration', dto);
    }
}
