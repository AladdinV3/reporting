import { MongooseFindOptions } from '@aldb2b/common';
import { IsOptional } from 'class-validator';

export class FindRFQDto extends MongooseFindOptions {
  @IsOptional()
  textSearch?: string;
}
