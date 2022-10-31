import { MeetingType, MongooseFindOptions } from '@aldb2b/common';
import { IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { MeetingStatus } from 'src/mongoose/models/meeting-status.enum';

export class SendAgendaDto extends MongooseFindOptions {
  @IsOptional()
  @IsMongoId({ each: true })
  participants?: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  companies?: string[];

  @IsOptional()
  @IsDateString()
  meetingDate?: Date;

  @IsOptional()
  @IsEnum(MeetingStatus, { each: true })
  status?: string[];

  @IsOptional()
  @IsEnum(MeetingType, { each: true })
  meetingType?: string[];

  @IsOptional()
  @IsMongoId()
  eventId?: string;
}
