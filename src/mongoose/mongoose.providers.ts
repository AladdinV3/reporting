import * as mongoose from 'mongoose';

export const mongooseProviders = [
  {
    provide: 'COMPANY_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(process.env.MONGO_URI_COMPANY),
  },
  {
    provide: 'EVENT_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(process.env.MONGO_URI_EVENT),
  },
  {
    provide: 'MEETING_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(process.env.MONGO_URI_MEETING),
  },
];
