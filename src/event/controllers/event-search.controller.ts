import { Controller, Get, Query } from '@nestjs/common';
import { SerializeResponse, ReadResult, GetEventId } from '@aldb2b/common';
import { EventService } from '../services/event.service';
import { FindEventDto } from '../dto/find-event.dto';
import { Event } from '../models/event.schema';

@Controller('events')
@SerializeResponse()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  searchEvents(@Query() filterDto: FindEventDto): Promise<ReadResult<Event>> {
    filterDto.lean = true;
    return this.eventService.list(filterDto);
  }
}
