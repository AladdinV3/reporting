import { Injectable } from '@nestjs/common';
import { HTMLGeneratorService } from 'src/html-generator/services/html-generator.services';
import { PDFGeneratorService } from 'src/pdf-generator/services/pdf-generator.services';
import { CompanyMongooseService } from 'src/mongoose/services/company-mongoose.service';
import { S3Buckets } from 'src/core/config/config';
import { AuthorizedS3 } from 'src/core/services/AWS';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PDFAgenda {
  private days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  private months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    private companyService: CompanyMongooseService,
    private htmlGeneratorService: HTMLGeneratorService,
    private pdfGeneratorService: PDFGeneratorService,
  ) {}

  async generate(meetings, event) {
    const classifiedMeetings = this.getClassifiedMeetingsByDate(meetings);
    const contactIds = this.getContactIds(meetings);
    const companyIds = this.getCompanyIds(meetings);
    const [contacts, companies] = await Promise.all([
      this.getContacts(contactIds),
      this.getCompanies(companyIds),
    ]);
    let content = '';
    let itemsInPage = 0;
    let pageNumber = 0;
    classifiedMeetings.forEach((meeting) => {
      const date = new Date(meeting.date);
      const rowspan = meeting.meetings.length;
      console.log('ROW SPAN------------------', rowspan);
      const meetingDetails = meeting.meetings.map((item) =>
        this.getMeetingDetails(item, contacts, companies),
      );
      let maxItems = pageNumber === 0 ? 6 : 7;
      let maxRowspan = 0;

      let currentItems = 0;
      meetingDetails.forEach((detail, index) => {
        if (currentItems === 0) {
          const sectionItemsCount =
            rowspan < maxItems - itemsInPage ? rowspan : maxItems - itemsInPage;
          content =
            content +
            `<table
              id="date-request"
              style="width: 90%; margin-top: 30px"
            ><tr>
            ${this.getDateSection(sectionItemsCount, date)}
            ${detail}
            </tr>`;
        } else {
          content = content + `<tr>${detail}</tr>`;
        }
        itemsInPage++;
        console.log('CURRENT ITEMS--------------------', currentItems);
        if (itemsInPage === maxItems) {
          content = content + '</table>' + this.breakPage();
          currentItems = 0;
          itemsInPage = 0;
          pageNumber++;
          maxItems = 7;
        } else {
          currentItems++;
        }
      });
    });
    console.log('MEETNGS------------', classifiedMeetings);
    console.log('CONTENT-----------------------', content);

    const htmlContent = await this.htmlGeneratorService.generate({
      content,
      logo: await this.getLogo(event),
    });
    const pdf = await this.pdfGeneratorService.generate(htmlContent);
    return pdf;
  }

  private async getLogo(event) {
    return event?.brandings[0]?.logoImage
      ? await this.downloadLogo(event?.brandings[0]?.logoImage)
      : this.getDefaultLogo();
  }

  private getDefaultLogo(): string {
    return readFileSync(
      join(__dirname, '../../../templates/emails/aladdin_logo.png'),
      {
        encoding: 'base64',
      },
    );
  }

  private async downloadLogo(fileKey: string): Promise<string> {
    const params = {
      Bucket: S3Buckets.brandingImages,
      Key: fileKey,
    };

    const downloadedFile = await AuthorizedS3.getObject(params).promise();
    return Buffer.from(downloadedFile.Body as Buffer).toString('base64');
  }

  private getClassifiedMeetingsByDate(meetings) {
    const allItemsByDate = [];
    meetings.forEach((meeting) => {
      const date = new Date(meeting.startTime);
      date.setHours(0, 0, 0, 0);
      const existingDateIndex = allItemsByDate.findIndex(
        (rec) => rec.date.getTime() === date.getTime(),
      );
      if (existingDateIndex !== -1) {
        allItemsByDate[existingDateIndex].meetings.push(meeting);
      } else {
        const newMeeting = {
          date,
          meetings: [meeting],
        };
        allItemsByDate.push(newMeeting);
      }
    });
    return allItemsByDate;
  }

  private getContactIds(meetings) {
    const contactIds = meetings
      .map((meeting) =>
        [
          meeting.hostIds.filter((id) => !!id).map(String),
          meeting.guestIds.filter((id) => !!id).map(String),
          meeting.createdBy ? String(meeting.createdBy) : null,
        ].flat(),
      )
      .flat();
    return [...new Set(contactIds)] as string[];
  }

  private getCompanyIds(meetings) {
    return meetings
      .map((meeting) =>
        [meeting.hostCompanyId, meeting.guestCompanyId]
          .filter((id) => !!id)
          .map(String),
      )
      .flat();
  }

  private async getContacts(contactIds: string[]) {
    console.log('CONTACT IDS---------------------', contactIds);
    return this.companyService.getContacts(
      { _id: { $in: contactIds } },
      {},
      { lean: true },
    );
  }

  private async getCompanies(companyIds: string[]) {
    console.log('COMPANY IDS------------------', companyIds);
    return this.companyService.getCompanies(
      { _id: { $in: companyIds } },
      {},
      { lean: true },
    );
  }

  private getMeetingDetails(meeting, contacts, companies) {
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);
    const createdBy = (contacts as any).find(
      (item) => String(item._id) === String(item.createdBy),
    );

    const hostNames = this.getContactNames(meeting.hostIds, contacts);
    const guestNames = this.getContactNames(meeting.guestIds, contacts);

    const hostCompany = this.findCompanyById(companies, meeting.hostCompanyId);
    const guestCompany = this.findCompanyById(
      companies,
      meeting.guestCompanyId,
    );

    return `${this.getTimeSection(startTime, endTime, createdBy)}
    ${this.getInfoSection(
      meeting,
      { names: hostNames, company: hostCompany },
      { names: guestNames, company: guestCompany },
    )}`;
  }

  private getContactNames(contactIds, contacts) {
    const hostRecrods = contactIds.map((item) => {
      const contact = contacts.find(
        (contact) => String(contact._id) === String(item),
      ) as any;
      return `${contact?.firstname || ''} ${contact?.lastname || ''}`;
    });
    let hostNames = '';
    hostRecrods.forEach((rec) => {
      hostNames = hostNames !== '' ? hostNames + ', ' + rec : rec;
    });
    return hostNames;
  }

  private findCompanyById(companies, companyId) {
    return companies.find(
      (company) => String(company._id) === String(companyId),
    ) as any;
  }

  private getTimeSection(startTime: Date, endTime: Date, createdBy) {
    return `<td class="date_no">
          <span
            style="font-size: 16px; font-weight: 400"
            >${startTime.getHours()}:${startTime.getMinutes()} - ${endTime.getHours()}:${endTime.getMinutes()}</span
          ><br />
          ${
            createdBy
              ? `<span
          style="
            font-size: 16px;
            font-weight: 400;
            color: crimson;
          "
          >By ${createdBy?.firstname || ''} ${createdBy?.lastname || ''}</span
        >`
              : ''
          }
        </td>`;
  }

  private getInfoSection(meeting, host, guest) {
    return `<td>
    <b
      ><span style="font-size: 16px"
        >Requester</span
      ></b
    ><br />
    <span style="font-size: 16px"
      >${host.names} @ ${host.company?.name}</span
    ><br />
    <b
      ><span style="font-size: 16px"
        >Oferor</span
      ></b
    ><br />
    <span style="font-size: 16px"
      >${guest.names} @ ${guest.company?.name}</span
    ><br />
    ${
      meeting?.hallId && meeting?.tableId
        ? `<b><span style="font-size: 16px">Location</span
    ></b>
    <br />
    <span style="font-size: 16px">
      ${meeting?.hallId?.name} ${meeting?.tableId?.name}
    </span>
  <br />`
        : ``
    }
    <b
      ><span style="font-size: 16px"
        >Status</span
      ></b
    ><br />
    <span style="font-size: 16px"
      >${meeting.status}</span
    >
  </td>`;
  }

  private breakPage() {
    return `<div style="break-after:page"></div>`; //`<div class="pagebreak"> </div>`;
  }

  private getDateSection(rowspan: number, date: Date) {
    return `<td class="date_no" rowspan="${rowspan}">
          <span style="font-size: 26px"
            >${date.getDate()}</span
          ><br />
          <span
            style="font-size: 16px; font-weight: 400"
            >${this.days[date.getDay()]}</span
          ><br />
          <span
            style="font-size: 16px; font-weight: 400"
            >${this.months[date.getMonth()]}, ${date.getFullYear()}</span
          >
          </td>`;
  }

  private getAgendaName(eventName, downloadDto) {}
}
