import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageBrokerService } from './services/message-broker.service';
import { MessageBrokerController } from './controllers/message-broker.controller';
import { SearchModule } from 'src/search/search.module';
import { MongooseNewModule } from 'src/mongoose/mongoose-new.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
    MongooseNewModule,
  ],
  controllers: [MessageBrokerController],
  providers: [MessageBrokerService],
})
export class MessageBrokerModule {}
