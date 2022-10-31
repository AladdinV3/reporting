import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageBrokerSenderService } from './services/message-broker-sender.service';
import { MongooseNewModule } from 'src/mongoose/mongoose-new.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'send_notifications_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    MongooseNewModule,
  ],
  controllers: [],
  providers: [MessageBrokerSenderService],
  exports: [MessageBrokerSenderService],
})
export class MessageBrokerSenderModule {}
