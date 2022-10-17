import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RFQ } from '../models/rfq.schema';

@Injectable()
export class RFQMongooseService {
  constructor(@Inject('RFQ_MODEL') private rfqModel: Model<RFQ>) {}

  async getModifiedModel(rfqId: string): Promise<RFQ> {
    return this.rfqModel.findById(
      rfqId,
      {},
      {
        lean: true,
        populate: [
          {
            path: 'products.product',
            select:
              '_id category type name brand productCode image color currency price description',
          },
          {
            path: 'products.categories',
            select: '_id title parentCategory categoryCode type',
          },
          {
            path: 'services.service',
            select: '_id category type name images description price currency',
          },
          {
            path: 'services.categories',
            select: '_id title parentCategory categoryCode type',
          },
          { path: 'company', select: '_id name website logo profileImage' },
          {
            path: 'invitedCompanies.company',
            select: '_id name website logo profileImage',
          },
        ],
      },
    );
  }
}
