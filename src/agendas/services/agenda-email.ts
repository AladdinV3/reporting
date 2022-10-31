import { Injectable } from '@nestjs/common';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { CompanyMongooseService } from 'src/mongoose/services/company-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import {
  addHours,
  NotificationEvent,
  NotificationType,
  SendNotifications,
  Subjects,
} from '@aldb2b/common';
import { PDFAgenda } from './pdf-agenda';
import { AuthorizedS3 } from 'src/core/services/AWS';
import { S3 } from 'aws-sdk';
import { S3Buckets } from 'src/core/config/config';
import { MessageBrokerSenderService } from 'src/message-broker-sender/services/message-broker-sender.service';

@Injectable()
export class AgendaEmail {
  constructor(
    private meetingService: MeetingMongooseService,
    private pdfAgenda: PDFAgenda,
    private eventService: EventMongooseService,
    private companyService: CompanyMongooseService,
    private messageBroker: MessageBrokerSenderService,
  ) {}

  async sendAgendaForContact(contactId: string, query) {
    const agendas = await this.getContactAgendas(query);
    console.log('AGENDA QUERY-----------------', query);
    console.log('AGENDA---------------', agendas);
    if (agendas.length) {
      const event = await this.eventService.findById(
        agendas[0].eventId,
        {},
        {},
      );
      const pdf = await this.pdfAgenda.generate(agendas, event);
      const reportName = await this.uploadPdfAgendaToS3(pdf);
      console.log('CONTACT ID--------------------', contactId);
      const contact = await this.companyService.getContact(
        { _id: contactId },
        {},
        { lean: true },
      );
      const emailContent = this.prepareEmailContent(contact, reportName);
      this.sendEmail(emailContent);
    }
  }

  private async getContactAgendas(query) {
    return this.meetingService.find(
      query,
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

  private sendEmail(notifications) {
    this.messageBroker.sendNotifications({
      subject: Subjects.SendNotifications,
      data: notifications,
    });
  }

  private prepareEmailContent(
    contact,
    reportName: string,
  ): SendNotifications.Data[] {
    return [
      {
        eventId: contact.eventId,
        receiver: contact._id,
        receiverCompany: contact.company,
        type: NotificationType.EMAIL,
        trigger: NotificationEvent.USER_DAILY_MEETING_AGENDA,
        content: '',
        template: 'UserDailyMeetingAgendaEmail',
        attachments: [reportName],
      },
    ];
  }
}
