import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type MeetingRequestSearchDocument = MeetingRequestSearch &
  Document & { _id: string };

@Schema({ strict: false })
export class MeetingRequestSearch extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialMeetingRequestSearchSchema =
  SchemaFactory.createForClass(MeetingRequestSearch);

InitialMeetingRequestSearchSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialMeetingRequestSearchSchema.statics.validateProjection = (
  necessaryProjectionArray,
) => validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialMeetingRequestSearchSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialMeetingRequestSearchSchema.statics.validateUpdateItem = (
  updateItemObj,
) => validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const MeetingRequestSearchSchema = InitialMeetingRequestSearchSchema;
