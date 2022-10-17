import { InjectModel } from '@nestjs/mongoose';
import { CustomModel, MongooseBase } from '@aldb2b/common';
import { MeetingSearch, MeetingSearchDocument } from './meeting-search.schema';

export class MeetingSearchRepository extends MongooseBase<MeetingSearchDocument> {
  constructor(
    @InjectModel(MeetingSearch.name)
    private meetingSearchModel: CustomModel<MeetingSearchDocument>,
  ) {
    super(meetingSearchModel);
  }
}
