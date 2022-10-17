import { Controller, Get, Query } from '@nestjs/common';
import {
  SerializeResponse,
  ReadResult,
  GetEventId,
  GetUser,
  HeaderUser,
} from '@aldb2b/common';
import { QuotationSearchService } from '../services/quotation-search.service';
import { FindQuotationDto } from '../dto/find-quotation.dto';

@Controller('quotations')
@SerializeResponse()
export class QuotationSearchController {
  constructor(
    private readonly quotationSearchService: QuotationSearchService,
  ) {}

  @Get('/all')
  searchAllQuotations(
    @GetEventId() eventId: string,
    @Query() filterDto: FindQuotationDto,
    @GetUser() user: HeaderUser,
  ): Promise<ReadResult<any>> {
    return this.quotationSearchService.allQuotations(filterDto, eventId, user);
  }

  @Get('/incoming')
  searchIncomingQuotations(
    @GetEventId() eventId: string,
    @Query() filterDto: FindQuotationDto,
    @GetUser() user: HeaderUser,
  ): Promise<ReadResult<any>> {
    return this.quotationSearchService.incomingQuotations(
      filterDto,
      eventId,
      user,
    );
  }

  @Get('/outgoing')
  searchOutgoingQuotations(
    @GetEventId() eventId: string,
    @Query() filterDto: FindQuotationDto,
    @GetUser() user: HeaderUser,
  ): Promise<ReadResult<any>> {
    console.log('INSIDE OUTGOING--------------');
    return this.quotationSearchService.outgoingQuotations(
      filterDto,
      eventId,
      user,
    );
  }
}
