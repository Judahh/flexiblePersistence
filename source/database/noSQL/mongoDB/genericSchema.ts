import BaseSchemaDefault from './baseSchemaDefault';
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

export default class GenericSchema extends BaseSchemaDefault {
  generateName(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setName('Generic');
  }
  protected attributes: SchemaDefinition = {
    id: {
      type: Schema.Types.ObjectId,
      unique: true,
      index: true,
    },
  };
  protected options: SchemaOptions = {
    strict: false,
    id: true,
    versionKey: false,
  };
}
