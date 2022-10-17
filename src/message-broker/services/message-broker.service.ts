import { Injectable } from '@nestjs/common';
import { CompanyMongooseService } from 'src/mongoose/services/company-mongoose.service';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { MeetingRequestMongooseService } from 'src/mongoose/services/meeting-request-mongoose.service';
import { QuotationMongooseService } from 'src/mongoose/services/quotation-mongoose.service';
import { RFQMongooseService } from 'src/mongoose/services/rfq-mongoose.service';
import { ElasticSearchIndex } from 'src/search/model/elastic-search-index.enum';
import { SearchService } from 'src/search/services/search.service';

@Injectable()
export class MessageBrokerService {
  constructor(
    private searchService: SearchService,
    private eventService: EventMongooseService,
    private companyService: CompanyMongooseService,
    private meetingService: MeetingMongooseService,
    private rfqService: RFQMongooseService,
    private quotationService: QuotationMongooseService,
    private meetingRequestService: MeetingRequestMongooseService,
  ) {}

  async updateCompany(updatedCompany) {
    const parsedCompany = JSON.parse(updatedCompany);
    const companyId = parsedCompany._id;
    const company = await this.companyService.getModifiedModel(companyId);
    delete company._id;
    await this.searchService.update(
      ElasticSearchIndex.COMPANY,
      companyId,
      company,
    );
  }

  async createCompany(createdCompany) {
    const parsedCompany = JSON.parse(createdCompany);
    const companyId = parsedCompany._id;
    const company = await this.companyService.getModifiedModel(companyId);
    await this.searchService.create(ElasticSearchIndex.COMPANY, company);
  }

  async createEvent(createdEvent) {
    const parsedEvent = JSON.parse(createdEvent);
    const eventId = parsedEvent._id;
    const event = await this.eventService.getModifiedModel(eventId);
    console.log('EVENT TO SEARCH--------------', event);
    await this.searchService.create(ElasticSearchIndex.EVENT, event);
  }

  async updateEvent(updatedEvent) {
    const parsedEvent = JSON.parse(updatedEvent);
    const eventId = parsedEvent._id;
    const event = await this.eventService.getModifiedModel(eventId);
    delete event._id;
    await this.searchService.update(ElasticSearchIndex.EVENT, eventId, event);
  }

  async createMeeting(createdMeeting) {
    const parsedMeeting = JSON.parse(createdMeeting);
    const meetingId = parsedMeeting._id;
    const meeting = await this.meetingService.getModifiedModel(meetingId);
    await this.searchService.create(ElasticSearchIndex.MEETING, meeting);
  }

  async updateMeeting(updatedMeeting) {
    const parsedMeeting = JSON.parse(updatedMeeting);
    const meetingId = parsedMeeting._id;
    const meeting = await this.meetingService.getModifiedModel(meetingId);
    delete meeting._id;
    await this.searchService.update(
      ElasticSearchIndex.MEETING,
      meetingId,
      meeting,
    );
  }

  async createMeetingRequest(createdMeetingRequest) {
    const parsedMeetingRequest = JSON.parse(createdMeetingRequest);
    const meetingRequestId = parsedMeetingRequest._id;
    const meetingRequest = await this.meetingRequestService.getModifiedModel(
      meetingRequestId,
    );
    await this.searchService.create(
      ElasticSearchIndex.MEETING_REQUEST,
      meetingRequest,
    );
  }

  async updateMeetingRequest(updatedMeetingRequest) {
    const parsedMeetingRequest = JSON.parse(updatedMeetingRequest);
    const meetingRequestId = parsedMeetingRequest._id;
    const meetingRequest = await this.meetingRequestService.getModifiedModel(
      meetingRequestId,
    );
    delete meetingRequest._id;
    await this.searchService.update(
      ElasticSearchIndex.MEETING_REQUEST,
      meetingRequestId,
      meetingRequest,
    );
  }

  async createRFQ(createdRFQ) {
    const parsedRFQ = JSON.parse(createdRFQ);
    const rfqId = parsedRFQ._id;
    const rfq = await this.rfqService.getModifiedModel(rfqId);
    await this.searchService.create(ElasticSearchIndex.RFQ, rfq);
  }

  async updateRFQ(updatedRFQ) {
    const parsedRFQ = JSON.parse(updatedRFQ);
    const rfqId = parsedRFQ._id;
    const rfq = await this.rfqService.getModifiedModel(rfqId);
    delete rfq._id;
    await this.searchService.update(ElasticSearchIndex.RFQ, rfqId, rfq);
  }

  async createQuotation(createdQuotation) {
    const parsedQuotation = JSON.parse(createdQuotation);
    const quotationId = parsedQuotation._id;
    const quotation = await this.quotationService.getModifiedModel(quotationId);
    await this.searchService.create(ElasticSearchIndex.QUOTATION, quotation);
  }

  async updateQuotation(updatedQuotation) {
    const parsedQuotation = JSON.parse(updatedQuotation);
    const quotationId = parsedQuotation._id;
    const quotation = await this.quotationService.getModifiedModel(quotationId);
    delete quotation._id;
    await this.searchService.update(
      ElasticSearchIndex.QUOTATION,
      quotationId,
      quotation,
    );
  }
}
