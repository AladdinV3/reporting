import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendNotifications } from '@aldb2b/common';

@Injectable()
export class MessageBrokerService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  sendNotifications(sendNotifications: SendNotifications.Context) {
    console.log(
      'NOTIFICATION SUBJECT---------------------',
      sendNotifications.subject,
    );
    console.log(
      'NOTIFICATION DATA----------------------',
      sendNotifications.data,
    );
    firstValueFrom(
      this.client.send(sendNotifications.subject, sendNotifications.data),
    );
  }
}
