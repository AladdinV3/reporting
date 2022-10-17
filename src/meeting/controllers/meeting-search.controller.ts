import { Controller, Get, Query } from '@nestjs/common';
import { SerializeResponse, ReadResult, GetEventId } from '@aldb2b/common';
import { MeetingSearchService } from '../services/meeting-search.service';
import { FindMeetingDto } from '../dto/find-meeting.dto';
import { MeetingSearch } from '../models/meeting-search.schema';

@Controller('meetings')
@SerializeResponse()
export class MeetingSearchController {
  constructor(private readonly eventService: MeetingSearchService) {}

  @Get()
  searchMeetings(
    @GetEventId() eventId: string,
    @Query() filterDto: FindMeetingDto,
  ): Promise<ReadResult<MeetingSearch>> {
    filterDto.lean = true;
    return this.eventService.list(filterDto, eventId);
  }
}
