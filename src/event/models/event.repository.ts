import { InjectModel } from '@nestjs/mongoose';
import { CustomModel, MongooseBase } from '@aldb2b/common';
import { Event } from './event.schema';
import { Inject } from '@nestjs/common';

export class EventRepository extends MongooseBase<Event> {
  constructor(
    @InjectModel(Event.name)
    private eventModel: CustomModel<Event>,
  ) {
    super(eventModel);
  }
}
