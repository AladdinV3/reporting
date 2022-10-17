import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { Company } from './company.schema';
import { Contact } from './contact.schema';
import { Category } from './category.schema';
import { Product } from './product.schema';
import { Service } from './service.schema';
import { RFQ } from './rfq.schema';

const Document = mongoose.Document;
const ObjectId = mongoose.Schema.Types.ObjectId;
export type QuotationDocument = Quotation & Document & { _id: string };

@Schema({ strict: false })
export class QuotationProduct extends Document {
  @Prop([{ type: ObjectId, ref: Category.name }])
  categories: Category[];

  @Prop({ type: ObjectId, ref: Product.name })
  product: Product;
}

@Schema({ strict: false })
export class QuotationService extends Document {
  @Prop([{ type: ObjectId, ref: Category.name }])
  categories: Category[];

  @Prop({ type: ObjectId, ref: Service.name })
  service: Service;
}

@Schema({ strict: false })
export class Quotation extends Document {
  @Prop({ type: ObjectId, ref: Company.name })
  company: Company;

  @Prop({ type: ObjectId, ref: Contact.name })
  contact: Contact;

  @Prop({ type: ObjectId, ref: RFQ.name })
  rfq: RFQ;

  @Prop([{ type: ObjectId, ref: Company.name }])
  receiverCompanies: Company;

  @Prop([{ type: ObjectId, ref: Contact.name }])
  receiverContacts: Contact;

  @Prop([{ type: QuotationService }])
  services: QuotationService[];

  @Prop([{ type: QuotationProduct }])
  products: QuotationProduct[];
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialQuotationSchema = SchemaFactory.createForClass(Quotation);

InitialQuotationSchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialQuotationSchema.statics.validateProjection = (
  necessaryProjectionArray,
) => validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialQuotationSchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialQuotationSchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const QuotationSchema = InitialQuotationSchema;
