import {
  NotificationEvent,
  NotificationType,
  RecordType,
  SendNotifications,
  Subjects,
} from '@aldb2b/common';
import { Encryptor } from './encryptor';
import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from './message-broker';
import { meetingRequestBaseUrl } from 'src/core/config';
import { TemplateType } from '../models/template-type.enum';
import { Template } from '../interfaces/template.interface';
import { MeetingRequest } from '../models/meeting-request.schema';
import { NotificationSpecs } from '../interfaces/notificaiton-specs.interface';
import { NotificationDetail } from '../interfaces/notificaiton-detail.interface';

@Injectable()
export class NotificationHandler {
  constructor(
    private messageBroker: MessageBrokerService,
    private encryptor: Encryptor,
  ) {}

  async newMeetingRequest(
    createdMeetingRequest: MeetingRequest,
    contacts,
  ): Promise<void> {
    const notifications = this.getMeetingRequestNotifications(
      createdMeetingRequest,
      contacts,
    );
    console.log('NOTIFICATIONS TO SEND -----------------', notifications);
    console.log('CONTACTS-------------', contacts);
    console.log(
      'CREATED MEETING REQUEST---------------',
      createdMeetingRequest,
    );
    this.messageBroker.sendNotifications({
      subject: Subjects.SendNotifications,
      data: notifications,
    });
  }

  private getMeetingRequestNotifications(
    createdMeetingRequest: MeetingRequest,
    contacts,
  ): SendNotifications.Data[] {
    return contacts
      .map((item) => {
        return [
          this.getEmailNotification(
            createdMeetingRequest,
            item,
            contacts.length === 1,
          ),
          this.getTemplateNotification(
            createdMeetingRequest,
            {
              contact: item._id,
              template: 'NewMeetingRequestPush',
              type: NotificationType.PUSH_NOTIFICATION,
              trigger: NotificationEvent.NEW_REQUEST_MEETING,
            },
            TemplateType.SENDER,
          ),
          this.getTemplateNotification(
            createdMeetingRequest,
            {
              contact: item._id,
              template: 'NewMeetingRequestWeb',
              type: NotificationType.SYSTEM,
              trigger: NotificationEvent.NEW_REQUEST_MEETING,
            },
            TemplateType.SENDER,
          ),
        ];
      })
      .flat();
  }

  private getEmailNotification(
    createdMeetingRequest: MeetingRequest,
    contact,
    hasSuggestion: boolean,
  ): SendNotifications.Data {
    return {
      eventId: createdMeetingRequest.eventId,
      receiver: contact._id,
      receiverCompany: contact.company._id,
      meetingRequest: createdMeetingRequest._id,
      senderCompany: String(createdMeetingRequest.hostCompanyId),
      senderContact: createdMeetingRequest.hostId,
      type: NotificationType.EMAIL,
      trigger: NotificationEvent.NEW_REQUEST_MEETING,
      content: createdMeetingRequest.content,
      links: this.getLinks(
        createdMeetingRequest.requestedTimes,
        contact._id,
        createdMeetingRequest._id,
        hasSuggestion,
      ),
      template: 'NewMeetingRequestEmail',
      attachments: createdMeetingRequest.attachments || [],
      relatedRecordId: createdMeetingRequest._id,
      relatedRecordType: RecordType.MEETING_REQUEST,
    };
  }

  private getLinks(
    meetingRequestDates: Date[],
    userId: string,
    meetingRequestId: string,
    hasSuggestion: boolean,
  ) {
    const links = { accept: [], reject: '', suggest: null };
    const token = this.encryptor.encrypt(userId, meetingRequestId);
    links.accept = meetingRequestDates.map((item) => ({
      link: `${meetingRequestBaseUrl}/accept?token=${token}&time=${item.toISOString()}`,
      date: item.toISOString(),
    }));
    links.reject = `${meetingRequestBaseUrl}/reject?token=${token}`;

    if (hasSuggestion) {
      links.suggest = `${meetingRequestBaseUrl}/suggest?token=${token}`;
    }
    return links;
  }

  async meetingRequestNotifications(
    meetingRequest: MeetingRequest,
    type: NotificationEvent,
    contactId?: string,
  ): Promise<void> {
    const { trigger, template } = this.getNotificationDetails(type);
    const notifications = this.getAllNotifications(
      meetingRequest,
      trigger,
      template,
      contactId,
    );
    console.log('notifications: ', JSON.stringify(notifications), type);
    this.messageBroker.sendNotifications({
      subject: Subjects.SendNotifications,
      data: notifications,
    });
  }

  private getAllNotifications(
    meetingRequest: MeetingRequest,
    trigger: NotificationEvent,
    template: Template,
    contactId?: string,
  ): SendNotifications.Data[] {
    return !contactId
      ? meetingRequest.contactIds
          .map((item) =>
            this.getNotifications(
              meetingRequest,
              trigger,
              template,
              TemplateType.SENDER,
              item,
            ),
          )
          .flat()
      : this.getNotifications(
          meetingRequest,
          trigger,
          template,
          TemplateType.RECEIVER,
          contactId,
        );
  }

  private getNotifications(
    meetingRequest: MeetingRequest,
    trigger: NotificationEvent,
    template: Template,
    templateType: TemplateType,
    contactId,
  ): SendNotifications.Data[] {
    return [
      this.getTemplateNotification(
        meetingRequest,
        {
          contact: contactId,
          trigger,
          type: NotificationType.EMAIL,
          template: template.email,
        },
        templateType,
      ),
      this.getTemplateNotification(
        meetingRequest,
        {
          contact: contactId,
          trigger,
          type: NotificationType.PUSH_NOTIFICATION,
          template: template.push,
        },
        templateType,
      ),
      this.getTemplateNotification(
        meetingRequest,
        {
          contact: contactId,
          trigger,
          type: NotificationType.SYSTEM,
          template: template.web,
        },
        templateType,
      ),
    ];
  }

  private getNotificationDetails(type: NotificationEvent): NotificationDetail {
    const resp = { trigger: type, template: { email: '', push: '', web: '' } };
    const template = { email: '', push: '', web: '' };
    if (type === NotificationEvent.REJECT_REQUEST_MEETING) {
      template.email = 'RejectMeetingRequestEmail';
      template.push = 'RejectMeetingRequestPush';
      template.web = 'RejectMeetingRequestWeb';
    } else if (type === NotificationEvent.ACCEPT_REQUEST_MEETING) {
      template.email = 'AcceptMeetingRequestEmail';
      template.push = 'AcceptMeetingRequestPush';
      template.web = 'AcceptMeetingRequestWeb';
    } else if (type === NotificationEvent.CANCEL_REQUEST_MEETING) {
      template.email = 'CancelMeetingRequestEmail';
      template.push = 'CancelMeetingRequestPush';
      template.web = 'CancelMeetingRequestWeb';
    } else if (type === NotificationEvent.RESCHEDULE_REQUEST_MEETING) {
      template.email = 'ProposeTimeMeetingRequestEmail';
      template.push = 'ProposeTimeMeetingRequestPush';
      template.web = 'ProposeTimeMeetingRequestWeb';
    } else if (type === NotificationEvent.UPDATE_REQUEST_MEETING) {
      template.email = 'UpdateMeetingRequestEmail';
      template.push = 'UpdateMeetingRequestPush';
      template.web = 'UpdateMeetingRequestWeb';
    } else if (type === NotificationEvent.NEW_REQUEST_MEETING) {
      template.email = 'NewMeetingRequestEmail';
      template.push = 'NewMeetingRequestPush';
      template.web = 'NewMeetingRequestWeb';
    }
    resp.template = template;
    return resp;
  }

  private getTemplateNotification(
    createdMeetingRequest: MeetingRequest,
    notificationSpecs: NotificationSpecs,
    type: TemplateType,
  ): SendNotifications.Data {
    const templateRelatedProps = this.getTemplateRelatedProperties(
      type,
      createdMeetingRequest,
      notificationSpecs,
    );

    console.log(
      'getTemplateNotification: ',
      JSON.stringify(templateRelatedProps),
      type,
    );
    return {
      ...templateRelatedProps,
      meetingRequest: createdMeetingRequest._id,
      eventId: createdMeetingRequest.eventId,
      type: notificationSpecs.type,
      trigger: notificationSpecs.trigger,
      template: notificationSpecs.template,
      attachments: createdMeetingRequest.attachments || [],
      relatedRecordId: createdMeetingRequest._id,
      relatedRecordType: RecordType.MEETING_REQUEST,
    };
  }

  private getTemplateRelatedProperties(
    type: TemplateType,
    createdMeetingRequest: MeetingRequest,
    notificationSpecs: NotificationSpecs,
  ) {
    console.log('type: ', type);
    return type === TemplateType.RECEIVER
      ? {
          receiver: createdMeetingRequest.hostId,
          receiverCompany: String(createdMeetingRequest.hostCompanyId),
          senderCompany: String(createdMeetingRequest.guestCompanyId),
          senderContact: notificationSpecs.contact,
          meetingRequest: createdMeetingRequest._id,
        }
      : {
          receiver: notificationSpecs.contact,
          receiverCompany: String(createdMeetingRequest.guestCompanyId),
          senderCompany: String(createdMeetingRequest.hostCompanyId),
          senderContact: createdMeetingRequest.hostId,
        };
  }
}
