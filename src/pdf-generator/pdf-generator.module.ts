import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PDFGeneratorService } from './services/pdf-generator.services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [PDFGeneratorService],
  exports: [PDFGeneratorService],
})
export class PDFGeneratorModule {}
