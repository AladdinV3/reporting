import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type EventTypeDocument = EventType & Document & { _id: string };

@Schema({ strict: false })
export class EventType extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialEventTypeSchema = SchemaFactory.createForClass(EventType);

InitialEventTypeSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialEventTypeSchema.statics.validateProjection = (
  necessaryProjectionArray,
) => validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialEventTypeSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialEventTypeSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const EventTypeSchema = InitialEventTypeSchema;
