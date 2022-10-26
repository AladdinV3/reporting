import { Injectable } from '@nestjs/common';
import { SendAgendaDto } from '../dto/send-agenda.dto';
import { DownloadAgendaDto } from '../dto/download-agenda.dto';
import { HTMLGeneratorService } from 'src/html-generator/services/html-generator.services';
import { PDFGeneratorService } from 'src/pdf-generator/services/pdf-generator.services';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { CompanyMongooseService } from 'src/mongoose/services/company-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addHours } from '@aldb2b/common';

@Injectable()
export class AgendaEmail {
  constructor(private meetingService: MeetingMongooseService) {}

  async sendAgendaEmails() {
    const agendas = await this.getIncomingMeetings();
    agendas.forEach((agenda) => {
      const emailContent = this.prepareEmailContent(agenda);
      this.sendEmail(emailContent);
    });
  }

  private async getIncomingMeetings() {
    const tomorrow = addHours(24, new Date());
    const hostIds = await this.meetingService.aggregate([
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
    const guestIds = await this.meetingService.distinctValues('guestIds', {
      startTime: { $gte: new Date(), $lte: tomorrow },
    });
    return this.meetingService.find(
      { startTime: { $gte: new Date(), $lte: tomorrow } },
      {},
      { lean: true },
    );
  }

  private prepareEmailContent(agenda) {}

  private sendEmail(content) {}
}
