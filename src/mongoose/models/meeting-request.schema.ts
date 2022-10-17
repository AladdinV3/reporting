import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { Contact } from './contact.schema';
import { Company } from './company.schema';

const Document = mongoose.Document;
const ObjectId = mongoose.Schema.Types.ObjectId;
export type MeetingRequestDocument = MeetingRequest &
  Document & { _id: string };

@Schema({ strict: false })
export class MeetingRequest extends Document {
  @Prop({ type: ObjectId })
  hostId: Contact;

  @Prop([{ type: ObjectId }])
  contactIds: Contact[];

  @Prop([{ type: ObjectId }])
  pendingContacts: Contact[];

  @Prop([{ type: ObjectId }])
  rejectedContacts: Contact[];

  @Prop([{ type: ObjectId }])
  acceptedContacts: Contact[];

  @Prop({ type: ObjectId })
  hostCompanyId: Company;

  @Prop({ type: ObjectId })
  guestCompanyId: Company;
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialMeetingRequestSchema =
  SchemaFactory.createForClass(MeetingRequest);

InitialMeetingRequestSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialMeetingRequestSchema.statics.validateProjection = (
  necessaryProjectionArray,
) => validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialMeetingRequestSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialMeetingRequestSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const MeetingRequestSchema = InitialMeetingRequestSchema;
