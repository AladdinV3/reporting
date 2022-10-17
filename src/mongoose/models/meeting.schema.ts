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
import { Table } from './table.schema';
import { Hall } from './hall.schema';

const Document = mongoose.Document;
const ObjectId = mongoose.Schema.Types.ObjectId;
export type MeetingDocument = Meeting & Document & { _id: string };

@Schema({ strict: false })
export class Meeting extends Document {
  @Prop([{ type: ObjectId }])
  hostIds: Contact[];

  @Prop([{ type: ObjectId }])
  guestIds: Contact[];

  @Prop([{ type: ObjectId }])
  guests: Contact[];

  @Prop({ type: ObjectId })
  hostCompanyId: Company;

  @Prop({ type: ObjectId })
  guestCompanyId: Company;

  @Prop({ type: ObjectId, ref: Table.name })
  tableId: Table;

  @Prop({ type: ObjectId, ref: Hall.name })
  hallId: Hall;
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialMeetingSchema = SchemaFactory.createForClass(Meeting);

InitialMeetingSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialMeetingSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialMeetingSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialMeetingSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const MeetingSchema = InitialMeetingSchema;
