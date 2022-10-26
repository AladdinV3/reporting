import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HTMLGeneratorService } from './services/html-generator.services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [HTMLGeneratorService],
  exports: [HTMLGeneratorService],
})
export class HTMLGeneratorModule {}
