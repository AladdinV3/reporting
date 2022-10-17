import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { Event } from './event.schema';

const ObjectId = mongoose.Schema.Types.ObjectId;
const Document = mongoose.Document;
export type BrandingDocument = Branding & Document & { _id: string };

@Schema({ strict: false })
export class Branding extends Document {
  @Prop({ type: ObjectId, ref: Event.name })
  eventId: Event;
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialBrandingSchema = SchemaFactory.createForClass(Branding);

InitialBrandingSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialBrandingSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialBrandingSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialBrandingSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const BrandingSchema = InitialBrandingSchema;
