import { MongooseFindOptions } from '@aldb2b/common';
import { IsOptional } from 'class-validator';

export class FindMeetingDto extends MongooseFindOptions {
  @IsOptional()
  textSearch?: string;
}
