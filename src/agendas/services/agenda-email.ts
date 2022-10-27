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
import { PDFAgenda } from './pdf-agenda';
import { AuthorizedS3 } from 'src/core/services/AWS';
import { S3 } from 'aws-sdk';
import { S3Buckets } from 'src/core/config/config';

@Injectable()
export class AgendaEmail {
  constructor(
    private meetingService: MeetingMongooseService,
    private pdfAgenda: PDFAgenda,
    private eventService: EventMongooseService,
    private companyService: CompanyMongooseService,
  ) {}

  async sendAgendaEmails() {
    const contactIds = await this.getContactIds();
    contactIds.forEach(async (contactId) => {
      const agendas = await this.getContactAgendas(contactId);
      const event = await this.eventService.findById(
        agendas[0].eventId,
        {},
        {},
      );
      const { pdf, fileName } = await this.pdfAgenda.generate(agendas, event);
      await this.uploadPdfAgendaToS3(pdf);
      const contact = await this.companyService.getContact(
        { _id: contactId },
        {},
        { lean: true },
      );
      const emailContent = await this.prepareEmailContent(contact);
      await this.sendEmail(emailContent);
    });
  }

  private async getContactIds() {
    const tomorrow = addHours(24, new Date());
    const meetings = await this.meetingService.aggregate([
      // { $match: { startTime: { $gte: new Date(), $lte: tomorrow } } },
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

  private async getContactAgendas(contactId: string) {
    const tomorrow = addHours(24, new Date());
    return this.meetingService.find(
      {
        $or: [{ guestIds: contactId }, { hostIds: contactId }],
        startTime: { $gte: new Date(), $lte: tomorrow },
      },
      {},
      { lean: true, sort: { startTime: 1 } },
    );
  }

  private async uploadPdfAgendaToS3(pdf) {
    const fileName = `Agenda-${new Date().getTime()}.pdf`;
    const params: S3.PutObjectRequest = {
      Bucket: S3Buckets.attachment,
      Key: fileName,
      Body: pdf,
    };
    await AuthorizedS3.upload(params).promise();
    return fileName;
  }

  private prepareEmailContent(agenda) {}

  private sendEmail(content) {}
}
