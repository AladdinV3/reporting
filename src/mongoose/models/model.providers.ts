import { Connection } from 'mongoose';
import { Branding, BrandingSchema } from './branding.schema';
import { Category, CategorySchema } from './category.schema';
import { City, CitySchema } from './city.schema';
import { Company, CompanySchema } from './company.schema';
import { Contact, ContactSchema } from './contact.schema';
import { Country, CountrySchema } from './country.schema';
import { EventType, EventTypeSchema } from './event-type.schema';
import { Event, EventSchema } from './event.schema';
import { Hall, HallSchema } from './hall.schema';
import { MeetingRequest, MeetingRequestSchema } from './meeting-request.schema';
import { Meeting, MeetingSchema } from './meeting.schema';
import { Product, ProductSchema } from './product.schema';
import { Quotation, QuotationSchema } from './quotation.schema';
import { RFQ, RFQSchema } from './rfq.schema';
import { Service, ServiceSchema } from './service.schema';
import { Table, TableSchema } from './table.schema';
import { Tag, TagSchema } from './tag.schema';

export const modelProviders = [
  {
    provide: 'COMPANY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Company.name, CompanySchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'CONTACT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Contact.name, ContactSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'CITY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(City.name, CitySchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'COUNTRY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Country.name, CountrySchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Product.name, ProductSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'SERVICE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Service.name, ServiceSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Category.name, CategorySchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'TAG_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Tag.name, TagSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'QUOTATION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Quotation.name, QuotationSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'RFQ_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(RFQ.name, RFQSchema),
    inject: ['COMPANY_CONNECTION'],
  },
  {
    provide: 'EVENT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Event.name, EventSchema),
    inject: ['EVENT_CONNECTION'],
  },
  {
    provide: 'BRANDING_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Branding.name, BrandingSchema),
    inject: ['EVENT_CONNECTION'],
  },
  {
    provide: 'EVENT_TYPE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(EventType.name, EventTypeSchema),
    inject: ['EVENT_CONNECTION'],
  },
  {
    provide: 'MEETING_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Meeting.name, MeetingSchema),
    inject: ['MEETING_CONNECTION'],
  },
  {
    provide: 'TABLE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Table.name, TableSchema),
    inject: ['MEETING_CONNECTION'],
  },
  {
    provide: 'HALL_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(Hall.name, HallSchema),
    inject: ['MEETING_CONNECTION'],
  },
  {
    provide: 'MEETING_REQUEST_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(MeetingRequest.name, MeetingRequestSchema),
    inject: ['MEETING_CONNECTION'],
  },
];
