import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingRequestSearchService } from './services/meeting-request-search.service';
import { MeetingRequestSearchController } from './controllers/meeting-search.controller';
import {
  MeetingRequestSearch,
  MeetingRequestSearchSchema,
} from './models/meeting-request-search.schema';
import { MeetingRequestSearchRepository } from './models/meeting-request-search.repository';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forFeature(
    //   [
    //     {
    //       name: MeetingRequestSearch.name,
    //       schema: MeetingRequestSearchSchema,
    //     },
    //   ],
    //   'meeting',
    // ),
    SearchModule,
  ],
  controllers: [MeetingRequestSearchController],
  providers: [MeetingRequestSearchService],
})
export class MeetingRequestSearchModule {}
