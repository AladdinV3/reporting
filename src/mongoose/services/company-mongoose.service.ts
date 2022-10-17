import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../models/company.schema';
import { Model } from 'mongoose';
import { Contact } from '../models/contact.schema';
import { City } from '../models/city.schema';
import { Country } from '../models/country.schema';
import { Product } from '../models/product.schema';
import { Service } from '../models/service.schema';
import { Tag } from '../models/tag.schema';

@Injectable()
export class CompanyMongooseService {
  constructor(
    @Inject('COMPANY_MODEL') private companyModel: Model<Company>,
    @Inject('CONTACT_MODEL') private contactModel: Model<Contact>,
    @Inject('CITY_MODEL') private cityModel: Model<City>,
    @Inject('COUNTRY_MODEL') private countryModel: Model<Country>,
    @Inject('PRODUCT_MODEL') private productModel: Model<Product>,
    @Inject('SERVICE_MODEL') private serviceModel: Model<Service>,
    @Inject('TAG_MODEL') private tagModel: Model<Tag>,
  ) {}

  async getModifiedModel(id: string) {
    const [company, services, products] = await Promise.all([
      this.getCompanyById(id),
      this.getServicesByCompanyId(id),
      this.getProductsByCompanyId(id),
    ]);
    company['services'] = services;
    company['products'] = products;
    return company;
  }

  private getCompanyById(id: string) {
    return this.companyModel.findById(
      id,
      {},
      {
        populate: [
          { path: 'country', select: '_id name' },
          { path: 'city', select: '_id name' },
          { path: 'contacts', select: '_id firstname lastname' },
          { path: 'keywords', select: '_id name' },
          { path: 'sectors.categories', select: '_id title categoryCode' },
          {
            path: 'demandingSectors.categories',
            select: '_id title categoryCode',
          },
        ],
        lean: true,
      },
    );
  }

  private getProductsByCompanyId(companyId: string) {
    return this.productModel.find(
      { company: companyId },
      {},
      {
        projection: { _id: 1, name: 1, description: 1, category: 1, type: 1 },
        lean: true,
      },
    );
  }

  private getServicesByCompanyId(companyId: string) {
    return this.serviceModel.find(
      { company: companyId },
      {},
      {
        projection: {
          _id: 1,
          name: 1,
          brand: 1,
          productCode: 1,
          description: 1,
          category: 1,
        },
        lean: true,
      },
    );
  }
}
