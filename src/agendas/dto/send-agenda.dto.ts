import { MongooseFindOptions } from '@aldb2b/common';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class SendAgendaDto extends MongooseFindOptions {
  @IsOptional()
  @IsMongoId({ each: true })
  participants?: string[];

  @IsOptional()
  @IsDateString()
  meetingDate?: Date;
}
