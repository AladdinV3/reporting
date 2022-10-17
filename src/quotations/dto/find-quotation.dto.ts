import { MongooseFindOptions } from '@aldb2b/common';
import { IsOptional } from 'class-validator';

export class FindQuotationDto extends MongooseFindOptions {
  @IsOptional()
  textSearch?: string;
}
