import { MongooseFindOptions } from '@aldb2b/common';
import { IsOptional } from 'class-validator';

export class FindCompanyDto extends MongooseFindOptions {
  @IsOptional()
  textSearch?: string;
}
