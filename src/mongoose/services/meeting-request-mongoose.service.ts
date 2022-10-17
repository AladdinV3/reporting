import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MeetingRequest } from '../models/meeting-request.schema';
import { MeetingMongooseService } from './meeting-mongoose.service';

@Injectable()
export class MeetingRequestMongooseService {
  constructor(
    @Inject('MEETING_REQUEST_MODEL')
    private meetingRequestModel: Model<MeetingRequest>,
    private meetingService: MeetingMongooseService,
  ) {}

  async getModifiedModel(meetingRequestId: string) {
    const meetingRequest = await this.meetingRequestModel.findById(
      meetingRequestId,
      {},
      { lean: true },
    );
    const contactIds = [
      ...meetingRequest.contactIds,
      meetingRequest.hostId,
    ].map(String);
    const companyIds = [
      meetingRequest.guestCompanyId,
      meetingRequest.hostCompanyId,
    ].map(String);

    const [contacts, companies] = await Promise.all([
      this.meetingService.getAllContacts(contactIds),
      this.meetingService.getAllCompanies(companyIds),
    ]);
    meetingRequest.hostCompanyId = companies.find(
      (item) => String(item._id) === String(meetingRequest.hostCompanyId),
    );
    meetingRequest.guestCompanyId = companies.find(
      (item) => String(item._id) === String(meetingRequest.guestCompanyId),
    );
    meetingRequest.hostId = contacts.find(
      (item) => String(item._id) === String(meetingRequest.hostId),
    );
    meetingRequest.contactIds = contacts;
    const pendingContacts = meetingRequest.pendingContacts.map(String);
    meetingRequest.pendingContacts = contacts.filter((item) =>
      pendingContacts.includes(String(item._id)),
    );
    const acceptedContacts = meetingRequest.acceptedContacts.map(String);
    meetingRequest.acceptedContacts = contacts.filter((item) =>
      acceptedContacts.includes(String(item._id)),
    );
    const rejectedContacts = meetingRequest.rejectedContacts.map(String);
    meetingRequest.rejectedContacts = contacts.filter((item) =>
      rejectedContacts.includes(String(item._id)),
    );
    return meetingRequest;
  }
}
