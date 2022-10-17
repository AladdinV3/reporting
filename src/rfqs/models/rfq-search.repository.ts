import { InjectModel } from '@nestjs/mongoose';
import { CustomModel, MongooseBase } from '@aldb2b/common';
import { RFQSearch, RFQSearchDocument } from './rfq-search.schema';

export class RFQSearchRepository extends MongooseBase<RFQSearchDocument> {
  constructor(
    @InjectModel(RFQSearch.name)
    private rfqSearchModel: CustomModel<RFQSearchDocument>,
  ) {
    super(rfqSearchModel);
  }
}
