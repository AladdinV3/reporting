import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type MeetingSearchDocument = MeetingSearch & Document & { _id: string };

@Schema({ strict: false })
export class MeetingSearch extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialMeetingSearchSchema = SchemaFactory.createForClass(MeetingSearch);

InitialMeetingSearchSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialMeetingSearchSchema.statics.validateProjection = (
  necessaryProjectionArray,
) => validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialMeetingSearchSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialMeetingSearchSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const MeetingSearchSchema = InitialMeetingSearchSchema;
