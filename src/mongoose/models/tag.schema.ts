import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type TagDocument = Tag & Document & { _id: string };

@Schema({ strict: false })
export class Tag extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialTagSchema = SchemaFactory.createForClass(Tag);

InitialTagSchema.statics.validateProjectionResult = (necessaryProjectionObj) =>
  validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialTagSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialTagSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialTagSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const TagSchema = InitialTagSchema;
