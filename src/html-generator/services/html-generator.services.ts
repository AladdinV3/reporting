import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as lodash from 'lodash';

@Injectable()
export class HTMLGeneratorService {
  constructor() {}

  async generate(templateData) {
    const headerPath = join(
      __dirname,
      '../../../templates/emails/header-template.jst',
    );
    const footerPath = join(
      __dirname,
      '../../../templates/emails/footer-template.jst',
    );
    const defaultTemplatePath = join(
      __dirname,
      '../../../templates/emails/default-template.jst',
    );
    const header = readFileSync(headerPath).toString();
    const footer = readFileSync(footerPath).toString();
    const template = readFileSync(defaultTemplatePath).toString();
    const finalContent = lodash.template(
      header + templateData.content + footer,
    )(templateData);
    console.log('FINAL CONTENT------------------', finalContent);
    return finalContent;
  }
}
