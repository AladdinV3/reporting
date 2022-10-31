import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgendasService } from './services/agendas.services';
import { AgendasController } from './controllers/agendas.controller';
import { HTMLGeneratorModule } from 'src/html-generator/html-generator.module';
import { PDFGeneratorModule } from 'src/pdf-generator/pdf-generator.module';
import { MongooseNewModule } from 'src/mongoose/mongoose-new.module';
import { PDFAgenda } from './services/pdf-agenda';
import { AgendaEmail } from './services/agenda-email';
import { MessageBrokerSenderModule } from 'src/message-broker-sender/message-broker-sender.module';
import { AgendaEmailCron } from './services/agenda-email-cron';
import { AgendaEmailDirect } from './services/agenda-email-direct';
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
    HTMLGeneratorModule,
    PDFGeneratorModule,
    MongooseNewModule,
    MessageBrokerSenderModule,
  ],
  controllers: [AgendasController],
  providers: [
    AgendasService,
    PDFAgenda,
    AgendaEmail,
    AgendaEmailCron,
    AgendaEmailDirect,
  ],
})
export class AgendaModule {}
