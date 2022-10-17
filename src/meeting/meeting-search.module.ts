import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingSearchService } from './services/meeting-search.service';
import { MeetingSearchController } from './controllers/meeting-search.controller';
import {
  MeetingSearch,
  MeetingSearchSchema,
} from './models/meeting-search.schema';
import { MeetingSearchRepository } from './models/meeting-search.repository';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forFeature(
    //   [{ name: MeetingSearch.name, schema: MeetingSearchSchema }],
    //   'meeting',
    // ),

    SearchModule,
  ],
  controllers: [MeetingSearchController],
  providers: [MeetingSearchService],
})
export class MeetingSearchModule {}
