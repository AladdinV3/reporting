import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware, AuthorizerMiddleware } from '@aldb2b/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventModule } from './event/event.module';
import { EventController } from './event/controllers/event-search.controller';
import { MeetingSearchModule } from './meeting/meeting-search.module';
import { MeetingSearchController } from './meeting/controllers/meeting-search.controller';
import { MeetingRequestSearchModule } from './meetingRequest/meeting-search.module';
import { MeetingRequestSearchController } from './meetingRequest/controllers/meeting-search.controller';
import { RFQSearchModule } from './rfqs/rfq-search.module';
import { MessageBrokerModule } from './message-broker/message-broker.module';
import { CompanySearchModule } from './company/company-search.module';
import { CompanySearchController } from './company/controllers/company-search.controller';
import { QuotationSearchController } from './quotations/controllers/quotation-search.controller';
import { QuotationSearchModule } from './quotations/quotation-search.module';
import { MongooseNewModule } from './mongoose/mongoose-new.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'user_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    MongooseNewModule,
    HealthCheckModule,
    EventModule,
    MeetingSearchModule,
    MeetingRequestSearchModule,
    RFQSearchModule,
    MessageBrokerModule,
    CompanySearchModule,
    QuotationSearchModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('*')
      .apply(AuthorizerMiddleware)
      .forRoutes(
        EventController,
        MeetingSearchController,
        MeetingRequestSearchController,
        RFQSearchModule,
        CompanySearchController,
        QuotationSearchController,
      );
  }
}
