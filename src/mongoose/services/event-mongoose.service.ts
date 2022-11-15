import { Inject, Injectable } from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';
import { Event } from '../models/event.schema';
import { Branding } from '../models/branding.schema';
import { City } from '../models/city.schema';
import { Company } from '../models/company.schema';
import { Country } from '../models/country.schema';
import { presignedUrlExpiration, S3Buckets } from 'src/core/config/config';
import { AuthorizedS3 } from 'src/core/services/AWS';

@Injectable()
export class EventMongooseService {
  constructor(
    @Inject('EVENT_MODEL') private eventModel: Model<Event>,
    @Inject('CITY_MODEL') private cityModel: Model<City>,
    @Inject('COUNTRY_MODEL') private countryModel: Model<Country>,
    @Inject('BRANDING_MODEL') private brandingModel: Model<Branding>,
    @Inject('COMPANY_MODEL') private companyModel: Model<Company>,
  ) {}

  async findById(id: string, projection, options: QueryOptions) {
    const [event, brandings] = await Promise.all([
      this.eventModel.findById(id, projection, options),
      this.getBrandingsByEventId(id),
    ]);
    brandings;
    return {
      ...event,
      brandings,
    };
  }

  async getModifiedModel(id: string) {
    try {
      const event = await this.eventModel.findById(
        id,
        {},
        {
          lean: true,
          populate: [{ path: 'eventTypeId', select: '_id type status' }],
        },
      );

      const [city, country, company] = await Promise.all([
        this.getCityById((event as any).cityId),
        this.getCountryById((event as any).countryId),
        this.getCompanyById((event as any).companyId),
      ]);

      console.log('RETRIEVED CITY------------------', city);
      console.log('RETREIVED COUNTRY----------------', country);
      return {
        ...event,
        companyId: company,
        brandings: await this.getBrandingsByEventId(id),
        cityId: city,
        countryId: country,
      };
    } catch (err) {
      console.log('FEED EVENT ELASTICSEARCH ERROR---------------', err);
    }
  }

  private getCityById(id: string) {
    return this.cityModel.findById(id, { _id: 1, name: 1 }, { lean: true });
  }

  private getCountryById(id: string) {
    return this.countryModel.findById(id, { _id: 1, name: 1 }, { lean: true });
  }

  private getBrandingsByEventId(eventId: string) {
    return this.brandingModel.find({ eventId });
  }

  private getCompanyById(id: string) {
    return this.companyModel.findById(
      id,
      { _id: 1, name: 1, website: 1 },
      { lean: true },
    );
  }
}
