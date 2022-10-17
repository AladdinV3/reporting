import { Exchanges } from '@aldb2b/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { buildDocument } from './core/services/buildDocument';
import { ExchangeType, RabbitMQServer } from './core/services/rmq';
import { InitiateElasticSearch } from './search/services/initiate-elastic-search';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new RabbitMQServer({
      queue: '*',
      exchange: Exchanges.TOPIC_EXCHANGE,
      exchangeType: ExchangeType.TOPIC,
      urls: [process.env.RABBITMQ_URI],
      noAck: true,
    }),
  });

  app.setGlobalPrefix('/api/v0.3/search');
  app.enableCors();
  buildDocument(app);
  const port = 3000;
  const initiateElasticSearch = app.get(InitiateElasticSearch);
  await initiateElasticSearch.initiate();
  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`search service listening on port ${port}`);
}
bootstrap();
