import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { EventType } from './event-type.schema';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Document = mongoose.Document;
export type EventDocument = Event & Document & { _id: string };

@Schema({ strict: false })
export class Event extends Document {
  @Prop({ type: ObjectId, ref: EventType.name })
  eventTypeId: EventType;
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialEventSchema = SchemaFactory.createForClass(Event);

InitialEventSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialEventSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialEventSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialEventSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const EventSchema = InitialEventSchema;
