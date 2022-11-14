import { Injectable } from '@nestjs/common';
import { SendAgendaDto } from '../dto/send-agenda.dto';
import { DownloadAgendaDto } from '../dto/download-agenda.dto';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addHours, HeaderUser, UserRole, UserType } from '@aldb2b/common';
import { PDFAgenda } from './pdf-agenda';
import { AgendaEmailCron } from './agenda-email-cron';
import { AgendaEmailDirect } from './agenda-email-direct';

@Injectable()
export class AgendasService {
  constructor(
    private eventService: EventMongooseService,
    private meetingService: MeetingMongooseService,
    private pdfAgenda: PDFAgenda,
    private agendaEmailCron: AgendaEmailCron,
    private agendaEmailDirect: AgendaEmailDirect,
  ) {}

  async downloadAgenda(
    downloadDto: DownloadAgendaDto,
    eventId: string,
    user: HeaderUser,
  ) {
    const event = await this.eventService.findById(eventId, {}, []);
    const meetings = await this.getMeetings(eventId, downloadDto, user);
    const reportName = this.getReportName(event?.name, downloadDto);
    const pdf = await this.pdfAgenda.generate(meetings, event);
    return { pdf, fileName: reportName };
  }

  private async getMeetings(
    eventId: string,
    downloadDto: DownloadAgendaDto | SendAgendaDto,
    user: HeaderUser,
  ) {
    const query = this.getMeetingQuery(eventId, downloadDto, user);
    return this.meetingService.find(
      query,
      {},
      {
        lean: true,
        sort: { startTime: 1 },
        popoulate: [{ path: 'hallId' }, { path: 'tableId' }],
      },
    );
  }

  private getMeetingQuery(
    eventId: string,
    downloadDto: DownloadAgendaDto | SendAgendaDto,
    user: HeaderUser,
  ) {
    const query = { eventId, $or: [] };
    if (
      user.type !== UserType.USER &&
      downloadDto.participants &&
      downloadDto.participants.length
    ) {
      query.$or.push(
        { hostIds: { $in: downloadDto.participants } },
        { guestIds: { $in: downloadDto.participants } },
      );
    }

    if (user.type === UserType.USER) {
      query.$or.push(
        { hostIds: { $in: user.contactId } },
        { guestIds: { $in: user.contactId } },
      );
    }

    if (downloadDto.meetingType && downloadDto.meetingType.length) {
      query['meetingType'] = { $in: downloadDto.meetingType };
    }

    if (downloadDto.status && downloadDto.status.length) {
      query['status'] = { $in: downloadDto.status };
    }

    if (downloadDto.meetingDate) {
      query['startTime'] = {
        $gte: downloadDto.meetingDate,
        $lte: addHours(24, new Date(downloadDto.meetingDate)),
      };
    }

    if (downloadDto.companies && downloadDto.companies.length) {
      query.$or.push(
        { hostCompanyId: { $in: downloadDto.companies } },
        { guestCompanyId: { $in: downloadDto.companies } },
      );
    }

    if (query.$or.length === 0) {
      delete query.$or;
    }
    return query;
  }

  private getReportName(eventName: string, downloadDto: DownloadAgendaDto) {
    if (downloadDto.meetingDate) {
      return `${eventName}-AllAgenda-${downloadDto.meetingDate}.pdf`;
    } else {
      return `${eventName}-AllAgenda.pdf`;
    }
  }

  async sendAgenda(sendDto: SendAgendaDto, eventId: string, user: HeaderUser) {
    const query = this.getMeetingQuery(eventId, sendDto, user);
    await this.agendaEmailDirect.sendDirectAgendaEmails(query);
    return { status: 'successful' };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendAgendaEmails() {
    await this.agendaEmailCron.sendAgendaEmails();
  }
}
