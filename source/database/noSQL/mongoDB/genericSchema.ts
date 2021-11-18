import BaseSchemaDefault from './baseSchemaDefault';
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

export default class GenericSchema extends BaseSchemaDefault {
  generateName(): void {
    this.setName('Generic');
  }
  protected attributes: SchemaDefinition = {
    id: {
      type: Schema.Types.ObjectId,
      unique: true,
      index: true,
    },
  };
  protected options = { strict: false, id: true, versionKey: false };

}
