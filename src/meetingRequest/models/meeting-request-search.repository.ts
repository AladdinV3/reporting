import { InjectModel } from '@nestjs/mongoose';
import { CustomModel, MongooseBase } from '@aldb2b/common';
import {
  MeetingRequestSearch,
  MeetingRequestSearchDocument,
} from './meeting-request-search.schema';

export class MeetingRequestSearchRepository extends MongooseBase<MeetingRequestSearchDocument> {
  constructor(
    @InjectModel(MeetingRequestSearch.name)
    private meetingRequestSearchModel: CustomModel<MeetingRequestSearchDocument>,
  ) {
    super(meetingRequestSearchModel);
  }
}
