import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RFQSearchService } from './services/rfq-search.service';
import { RFQSearchController } from './controllers/rfq-search.controller';
import { RFQSearch, RFQSearchSchema } from './models/rfq-search.schema';
import { RFQSearchRepository } from './models/rfq-search.repository';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forFeature(
    //   [
    //     {
    //       name: RFQSearch.name,
    //       schema: RFQSearchSchema,
    //     },
    //   ],
    //   'company',
    // ),
    SearchModule,
  ],
  controllers: [RFQSearchController],
  providers: [RFQSearchService],
})
export class RFQSearchModule {}
