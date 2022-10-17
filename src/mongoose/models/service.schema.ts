import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type ServiceDocument = Service & Document & { _id: string };

@Schema({ strict: false })
export class Service extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialServiceSchema = SchemaFactory.createForClass(Service);

InitialServiceSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialServiceSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialServiceSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialServiceSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const ServiceSchema = InitialServiceSchema;
