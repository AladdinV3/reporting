import * as mongoose from 'mongoose';

export const mongooseProviders = [
  {
    provide: 'COMPANY_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(
        process.env.MONGO_URI_COMPANY ||
          'mongodb+srv://aladdinb2b:aladdinb2b@cluster0.aigop.mongodb.net/company?retryWrites=true&w=majority',
      ),
  },
  {
    provide: 'EVENT_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(
        process.env.MONGO_URI_EVENT ||
          'mongodb+srv://aladdinb2b:aladdinb2b@cluster0.aigop.mongodb.net/event?retryWrites=true&w=majority',
      ),
  },
  {
    provide: 'MEETING_CONNECTION',
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(
        process.env.MONGO_URI_MEETING ||
          'mongodb+srv://aladdinb2b:aladdinb2b@cluster0.aigop.mongodb.net/meeting?retryWrites=true&w=majority',
      ),
  },
];
