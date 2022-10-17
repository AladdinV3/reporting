import * as mongoose from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';

const Document = mongoose.Document;
export type ProductDocument = Product & Document & { _id: string };

@Schema({ strict: false })
export class Product extends Document {}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialProductSchema = SchemaFactory.createForClass(Product);

InitialProductSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialProductSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialProductSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialProductSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const ProductSchema = InitialProductSchema;
