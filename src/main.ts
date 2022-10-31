import { Exchanges } from '@aldb2b/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ExchangeType, RabbitMQServer } from './core/services/rmq';

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

  app.setGlobalPrefix('/api/v0.3/reporting');
  app.enableCors();
  const port = 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Reporting service listening on port ${port}`);
}
bootstrap();
