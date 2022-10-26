import { SendNotifications } from '@aldb2b/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MessageBrokerSenderService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  sendNotifications(sendNotifications: SendNotifications.Context) {
    firstValueFrom(
      this.client.send(sendNotifications.subject, sendNotifications.data),
    );
  }
}
