import { Injectable } from '@nestjs/common';
import { CompanyMongooseService } from 'src/mongoose/services/company-mongoose.service';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { MeetingRequestMongooseService } from 'src/mongoose/services/meeting-request-mongoose.service';
import { QuotationMongooseService } from 'src/mongoose/services/quotation-mongoose.service';
import { RFQMongooseService } from 'src/mongoose/services/rfq-mongoose.service';

@Injectable()
export class MessageBrokerService {
  constructor() {}
}
