import { Inject, Injectable } from '@nestjs/common';
import { Meeting } from '../models/meeting.schema';
import { Model, QueryOptions } from 'mongoose';
import { Company } from '../models/company.schema';
import { Contact } from '../models/contact.schema';

@Injectable()
export class MeetingMongooseService {
  constructor(
    @Inject('MEETING_MODEL') private meetingModel: Model<Meeting>,
    @Inject('COMPANY_MODEL') private companyModel: Model<Company>,
    @Inject('CONTACT_MODEL') private contactModel: Model<Contact>,
  ) {}

  async find(query, projections, options?) {
    return this.meetingModel.find(query, projections, options);
  }

  async findById(id: string, projection, options: QueryOptions) {
    return this.meetingModel.findById(id, projection, options);
  }

  async getModifiedModel(meetingId: string) {
    const meeting = await this.meetingModel.findById(
      meetingId,
      {},
      { populate: [{ path: 'tableId' }, { path: 'hallId' }], lean: true },
    );

    const meetingHostIds = meeting.hostIds.map(String);
    const meetingGuestIds = meeting.guestIds.map(String);
    const meetingGuests = meeting.guests.map(String);

    const contactIds = [
      ...meetingHostIds,
      ...meetingGuestIds,
      ...meetingGuests,
    ];
    const companyIds = this.extractCompanies(meeting);

    const [companies, contacts] = await Promise.all([
      this.getAllCompanies(companyIds),
      this.getAllContacts(contactIds),
    ]);

    const hostIds = contacts.filter((item) =>
      meetingHostIds.includes(String(item._id)),
    );
    const guestIds = contacts.filter((item) =>
      meetingGuestIds.includes(String(item._id)),
    );
    const guests = contacts.filter((item) =>
      meetingGuests.includes(String(item._id)),
    );

    const hostCompanyId = companies.find(
      (company) => String(company._id) === String(meeting.hostCompanyId),
    );
    const guestCompanyId = companies.find(
      (company) => String(company._id) === String(meeting.guestCompanyId),
    );
    meeting.guestIds = guestIds;
    meeting.hostIds = hostIds;
    meeting.guests = guests;
    meeting.hostCompanyId = hostCompanyId;
    meeting.guestCompanyId = guestCompanyId;
    return meeting;
  }

  private extractCompanies(meeting: Meeting): string[] {
    return [String(meeting.hostCompanyId), String(meeting.guestCompanyId)];
  }

  public async getAllContacts(contactIds: string[]) {
    return this.contactModel.find(
      { _id: { $in: contactIds } },
      { _id: 1, firstname: 1, lastname: 1, email: 1, mobile: 1, avatar: 1 },
      { lean: true },
    );
  }

  public async getAllCompanies(companyIds: string[]) {
    return this.companyModel.find(
      { _id: { $in: companyIds } },
      { _id: 1, name: 1, website: 1, country: 1, logo: 1, profileImage: 1 },
      { lean: true, populate: { path: 'country', select: '_id name' } },
    );
  }
}
