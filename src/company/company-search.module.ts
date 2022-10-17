import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanySearchService } from './services/company-search.service';
import { CompanySearchController } from './controllers/company-search.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchModule,
  ],
  controllers: [CompanySearchController],
  providers: [CompanySearchService],
})
export class CompanySearchModule {}
