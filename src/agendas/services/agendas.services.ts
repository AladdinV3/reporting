import { Injectable } from '@nestjs/common';
import { SendAgendaDto } from '../dto/send-agenda.dto';
import { DownloadAgendaDto } from '../dto/download-agenda.dto';
import { EventMongooseService } from 'src/mongoose/services/event-mongoose.service';
import { MeetingMongooseService } from 'src/mongoose/services/meeting-mongoose.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addHours } from '@aldb2b/common';
import { AgendaEmail } from './agenda-email';
import { PDFAgenda } from './pdf-agenda';

@Injectable()
export class AgendasService {
  constructor(
    private eventService: EventMongooseService,
    private meetingService: MeetingMongooseService,
    private pdfAgenda: PDFAgenda,
    private agendaEmail: AgendaEmail,
  ) {}

  async downloadAgenda(downloadDto: DownloadAgendaDto, eventId: string) {
    const event = await this.eventService.findById(eventId, {}, []);
    const meetings = await this.getMeetings(eventId, downloadDto);

    return this.pdfAgenda.generate(meetings, event);
  }

  private async getMeetings(eventId: string, downloadDto: DownloadAgendaDto) {
    const query = { eventId };
    if (downloadDto.participants && downloadDto.participants.length) {
      query['$or'] = [
        { hostIds: downloadDto.participants },
        { guestIds: downloadDto.participants },
      ];
    }
    if (downloadDto.meetingDate) {
      query['startTime'] = {
        $gte: downloadDto.meetingDate,
        $lte: addHours(24, new Date(downloadDto.meetingDate)),
      };
    }
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

  async sendAgenda(sendDto: SendAgendaDto, eventId: string) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendAgendaEmails() {
    await this.agendaEmail.sendAgendaEmails();
  }
}
