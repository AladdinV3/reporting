import { Controller, Get, Query } from '@nestjs/common';
import { SerializeResponse, GetEventId } from '@aldb2b/common';
import { CompanySearchService } from '../services/company-search.service';
import { FindCompanyDto } from '../dto/find-company.dto';
import { SearchHitsMetadata } from '@elastic/elasticsearch/lib/api/types';

@Controller('companies')
@SerializeResponse()
export class CompanySearchController {
  constructor(private readonly companyService: CompanySearchService) {}

  @Get()
  searchCompanys(
    @Query() filterDto: FindCompanyDto,
    @GetEventId() eventId: string,
  ): Promise<SearchHitsMetadata> {
    filterDto.lean = true;
    return this.companyService.list(filterDto, eventId);
  }
}
