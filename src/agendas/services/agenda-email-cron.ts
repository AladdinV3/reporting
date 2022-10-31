import { Injectable } from '@nestjs/common';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { addHours } from '@aldb2b/common';
import { AgendaEmail } from './agenda-email';

@Injectable()
export class AgendaEmailCron {
  constructor(
    private meetingService: MeetingMongooseService,
    private agendaEmail: AgendaEmail,
  ) {}

  async sendAgendaEmails() {
    const contactIds = await this.getContactIds();
    contactIds.forEach(async (contactId) => {
      const tomorrow = addHours(24, new Date());
      const finalQuery = {
        $or: [{ guestIds: contactId }, { hostIds: contactId }],
        startTime: { $gte: new Date(), $lte: tomorrow },
      };
      await this.agendaEmail.sendAgendaForContact(contactId, finalQuery);
    });
  }

  private async getContactIds() {
    const tomorrow = addHours(24, new Date());
    const meetings = await this.meetingService.aggregate([
      { $match: { startTime: { $gte: new Date(), $lte: tomorrow } } },
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
