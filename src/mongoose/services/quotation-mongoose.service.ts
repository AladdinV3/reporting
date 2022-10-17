import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RFQ } from '../models/rfq.schema';

@Injectable()
export class QuotationMongooseService {
  constructor(@Inject('QUOTATION_MODEL') private quotationModel: Model<RFQ>) {}

  async getModifiedModel(rfqId: string): Promise<RFQ> {
    return this.quotationModel.findById(
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
          { path: 'rfq', select: '_id title company invitedCompanies' },
          { path: 'company', select: '_id name website logo profileImage' },
          { path: 'contact', select: '_id firstname lastname fullname avatar' },
          { path: 'receiverCompanies', select: '_id name website' },
          {
            path: 'receiverContacts',
            select: '_id firstname lastname fullname',
          },
        ],
      },
    );
  }
}
