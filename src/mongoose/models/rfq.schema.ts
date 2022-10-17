import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { Company } from './company.schema';
import { Category } from './category.schema';
import { Product } from './product.schema';
import { Service } from './service.schema';

const Document = mongoose.Document;
const ObjectId = mongoose.Schema.Types.ObjectId;
export type RFQDocument = RFQ & Document & { _id: string };

@Schema({ strict: false })
export class RFQProduct extends Document {
  @Prop([{ type: ObjectId, ref: Category.name }])
  categories: Category[];

  @Prop({ type: ObjectId, ref: Product.name })
  product: Product;
}

@Schema({ strict: false })
export class RFQService extends Document {
  @Prop([{ type: ObjectId, ref: Category.name }])
  categories: Category[];

  @Prop({ type: ObjectId, ref: Service.name })
  service: Service;
}

@Schema({ strict: false })
export class InvitedCompany extends Document {
  @Prop({ type: ObjectId, ref: Company.name })
  company: Company;
}

@Schema({ strict: false })
export class RFQ extends Document {
  @Prop({ type: ObjectId, ref: Company.name })
  company: Company;

  @Prop([{ type: ObjectId, ref: Company.name }])
  invitedCompanies: InvitedCompany[];

  @Prop([{ type: RFQService }])
  services: RFQService[];

  @Prop([{ type: RFQProduct }])
  products: RFQProduct[];
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialRFQSchema = SchemaFactory.createForClass(RFQ);

InitialRFQSchema.statics.validateProjectionResult = (necessaryProjectionObj) =>
  validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialRFQSchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialRFQSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialRFQSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const RFQSchema = InitialRFQSchema;
