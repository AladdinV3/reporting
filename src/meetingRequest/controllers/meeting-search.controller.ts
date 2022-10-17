import { Controller, Get, Query } from '@nestjs/common';
import { SerializeResponse, ReadResult, GetEventId } from '@aldb2b/common';
import { MeetingRequestSearchService } from '../services/meeting-request-search.service';
import { FindMeetingRequestDto } from '../dto/find-meeting-request.dto';
import { MeetingRequestSearch } from '../models/meeting-request-search.schema';

@Controller('meeting-requests')
@SerializeResponse()
export class MeetingRequestSearchController {
  constructor(private readonly eventService: MeetingRequestSearchService) {}

  @Get()
  searchMeetingRequests(
    @GetEventId() eventId: string,
    @Query() filterDto: FindMeetingRequestDto,
  ): Promise<ReadResult<MeetingRequestSearch>> {
    filterDto.lean = true;
    return this.eventService.list(filterDto, eventId);
  }
}
