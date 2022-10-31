import { Injectable } from '@nestjs/common';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { AgendaEmail } from './agenda-email';

@Injectable()
export class AgendaEmailDirect {
  constructor(
    private meetingService: MeetingMongooseService,
    private agendaEmail: AgendaEmail,
  ) {}

  async sendDirectAgendaEmails(query) {
    const contactIds = await this.getContactIds(query);
    contactIds.forEach(async (contactId) => {
      const sendQuery = {
        $or: [{ guestIds: contactId }, { hostIds: contactId }],
        ...query,
      };
      await this.agendaEmail.sendAgendaForContact(contactId, sendQuery);
    });
  }

  private async getContactIds(query) {
    const meetings = await this.meetingService.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          hostIds: { $push: '$hostIds' },
          guestIds: { $push: '$guestIds' },
        },
      },
      {
        $project: {
          hostIds: {
            $reduce: {
              input: '$hostIds',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
          guestIds: {
            $reduce: {
              input: '$guestIds',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },
    ]);
    return meetings.length > 0
      ? [
          ...new Set([
            ...meetings[0].hostIds.filter((item) => !!item).map(String),
            ...meetings[0].guestIds.filter((item) => !!item).map(String),
          ]),
        ]
      : [];
  }
}
