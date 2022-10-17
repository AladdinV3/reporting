import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuotationSearchService } from './services/quotation-search.service';
import { QuotationSearchController } from './controllers/quotation-search.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
  ],
  controllers: [QuotationSearchController],
  providers: [QuotationSearchService],
})
export class QuotationSearchModule {}
