import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageBrokerSenderService } from './services/message-broker-sender.service';
import { MongooseNewModule } from 'src/mongoose/mongoose-new.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseNewModule,
  ],
  controllers: [],
  providers: [MessageBrokerSenderService],
})
export class MessageBrokerSenderModule {}
