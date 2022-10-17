import { Module } from '@nestjs/common';
import { modelProviders } from './models/model.providers';
import { mongooseProviders } from './mongoose.providers';
import { CompanyMongooseService } from './services/company-mongoose.service';
import { EventMongooseService } from './services/event-mongoose.service';
import { MeetingMongooseService } from './services/meeting-mongoose.service';
import { MeetingRequestMongooseService } from './services/meeting-request-mongoose.service';
import { QuotationMongooseService } from './services/quotation-mongoose.service';
import { RFQMongooseService } from './services/rfq-mongoose.service';

@Module({
  providers: [
    ...mongooseProviders,
    ...modelProviders,
    EventMongooseService,
    CompanyMongooseService,
    MeetingMongooseService,
    RFQMongooseService,
    QuotationMongooseService,
    MeetingRequestMongooseService,
  ],
  exports: [
    ...mongooseProviders,
    EventMongooseService,
    CompanyMongooseService,
    MeetingMongooseService,
    RFQMongooseService,
    QuotationMongooseService,
    MeetingRequestMongooseService,
  ],
})
export class MongooseNewModule {}
