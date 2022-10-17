import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event-search.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
