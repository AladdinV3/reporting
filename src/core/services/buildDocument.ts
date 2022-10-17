import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildDocument(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('AladinB2B-Hub search service')
    .setDescription('The AladinB2B Hub API description')
    .setVersion('0.3')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v0.3/search/document', app, document);
}
