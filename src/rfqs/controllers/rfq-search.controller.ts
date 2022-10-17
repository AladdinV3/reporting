import { Controller, Get, Query } from '@nestjs/common';
import { SerializeResponse, ReadResult, GetEventId } from '@aldb2b/common';
import { RFQSearchService } from '../services/rfq-search.service';
import { FindRFQDto } from '../dto/find-rfq.dto';
import { RFQSearch } from '../models/rfq-search.schema';

@Controller('rfqs')
@SerializeResponse()
export class RFQSearchController {
  constructor(private readonly rfqSearchService: RFQSearchService) {}

  @Get()
  searchRFQs(
    @GetEventId() eventId: string,
    @Query() filterDto: FindRFQDto,
  ): Promise<ReadResult<RFQSearch>> {
    filterDto.lean = true;
    return this.rfqSearchService.list(filterDto, eventId);
  }
}
