import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  validateProjection,
  validateNewItem,
  validateUpdateItem,
  validateProjectionResult,
} from '@aldb2b/common';
import { Contact } from './contact.schema';
import { City } from './city.schema';
import { Country } from './country.schema';
import { Tag } from './tag.schema';
import { Category } from './category.schema';

const Document = mongoose.Document;
const ObjectId = mongoose.Schema.Types.ObjectId;
export type CompanyDocument = Company & Document & { _id: string };

@Schema({ strict: false })
export class Sector extends Document {
  @Prop({ type: ObjectId, ref: Category.name })
  categories: Category[];
}

@Schema({ strict: false })
export class Company extends Document {
  @Prop({ type: ObjectId, ref: Contact.name })
  contacts: Contact[];

  @Prop({ type: ObjectId, ref: City.name })
  city: City;

  @Prop({ type: ObjectId, ref: Country.name })
  country: Country;

  @Prop({ type: ObjectId, ref: Tag.name })
  keywords: Tag;

  @Prop([{ type: Sector }])
  sectors: Sector[];

  @Prop([{ type: Sector }])
  demandingSectors: Sector[];
}

const allProjectionFieldArray = [];

const allValidateNewItemFieldArray = [];

const allValidateUpdateItemFieldArray = [];

const InitialCompanySchema = SchemaFactory.createForClass(Company);

InitialCompanySchema.statics.validateProjectionResult = (
  necessaryProjectionObj,
) => validateProjectionResult(allProjectionFieldArray, necessaryProjectionObj);

InitialCompanySchema.statics.validateProjection = (necessaryProjectionArray) =>
  validateProjection(allProjectionFieldArray, necessaryProjectionArray);

InitialCompanySchema.statics.validateNewItem = (newItemObj) =>
  validateNewItem(allValidateNewItemFieldArray, newItemObj);

InitialCompanySchema.statics.validateUpdateItem = (updateItemObj) =>
  validateUpdateItem(allValidateUpdateItemFieldArray, updateItemObj);

export const CompanySchema = InitialCompanySchema;
