import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { SerializeResponse, GetEventId } from '@aldb2b/common';
import { AgendasService } from '../services/agendas.services';
import { SendAgendaDto } from '../dto/send-agenda.dto';
import { DownloadAgendaDto } from '../dto/download-agenda.dto';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('agendas')
export class AgendasController {
  constructor(private readonly agendaService: AgendasService) {}

  @Get('/download')
  async downloadAgendas(
    @Query() downloadDto: DownloadAgendaDto,
    @GetEventId() eventId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { pdf, fileName } = await this.agendaService.downloadAgenda(
      downloadDto,
      eventId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=' + fileName,
    });
    return new StreamableFile(pdf);
  }

  @Get('/send')
  @SerializeResponse()
  sendAgendas(@Query() sendDto: SendAgendaDto, @GetEventId() eventId: string) {
    return this.agendaService.sendAgenda(sendDto, eventId);
  }
}
