import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type HallDocument = Hall & Document & { _id: string };

@Schema({ strict: false })
export class Hall extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialHallSchema = SchemaFactory.createForClass(Hall);

InitialHallSchema.statics.validateProjectionResult = (necessaryProjectionObj) =>
  validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialHallSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialHallSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialHallSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const HallSchema = InitialHallSchema;
