import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware, AuthorizerMiddleware } from '@aldb2b/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageBrokerModule } from './message-broker/message-broker.module';
import { MongooseNewModule } from './mongoose/mongoose-new.module';
import { AgendaModule } from './agendas/agenda.module';
import { AgendasController } from './agendas/controllers/agendas.controller';
import { HTMLGeneratorModule } from './html-generator/html-generator.module';
import { PDFGeneratorModule } from './pdf-generator/pdf-generator.module';

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
    MessageBrokerModule,
    AgendaModule,
    HTMLGeneratorModule,
    PDFGeneratorModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('*')
      .apply(AuthorizerMiddleware)
      .forRoutes(AgendasController);
  }
}
