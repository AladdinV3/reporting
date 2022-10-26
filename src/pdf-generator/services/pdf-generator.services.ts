import { Injectable } from '@nestjs/common';
import { launch } from 'puppeteer';

@Injectable()
export class PDFGeneratorService {
  constructor() {}

  async generate(htmlContent) {
    try {
      console.log(
        'BEFORE LAUNCH---------------',
        process.env.PUPPETEER_EXECUTABLE_PATH,
      );
      const browser = await launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });
      console.log('AFTER ---------------');

      const page = await browser.newPage();

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      console.log('BEFORE PDF---------------');
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
      });
      console.log('AFTER PDF---------------');
      await browser.close();
      console.log('AFTER CLOSE---------------');
      return pdf;
    } catch (err) {
      throw err;
    }
  }
}
