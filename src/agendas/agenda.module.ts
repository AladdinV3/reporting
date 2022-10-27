import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgendasService } from './services/agendas.services';
import { AgendasController } from './controllers/agendas.controller';
import { HTMLGeneratorModule } from 'src/html-generator/html-generator.module';
import { PDFGeneratorModule } from 'src/pdf-generator/pdf-generator.module';
import { MongooseNewModule } from 'src/mongoose/mongoose-new.module';
import { PDFAgenda } from './services/pdf-agenda';
import { AgendaEmail } from './services/agenda-email';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HTMLGeneratorModule,
    PDFGeneratorModule,
    MongooseNewModule,
  ],
  controllers: [AgendasController],
  providers: [AgendasService, PDFAgenda, AgendaEmail],
})
export class AgendaModule {}
