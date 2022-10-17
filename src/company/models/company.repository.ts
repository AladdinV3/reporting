import { InjectModel } from '@nestjs/mongoose';
import { CustomModel, MongooseBase } from '@aldb2b/common';
import { Company, CompanyDocument } from './company.schema';

export class CompanyRepository extends MongooseBase<CompanyDocument> {
  constructor(
    @InjectModel(Company.name)
    private companyModel: CustomModel<CompanyDocument>,
  ) {
    super(companyModel);
  }
}
