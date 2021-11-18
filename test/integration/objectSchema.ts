import { Schema } from 'mongoose';
import { BaseSchemaDefault } from '../../source';

export default class ObjectSchema extends BaseSchemaDefault {
  generateName(): void {
    this.setName('object');
  }
  protected attributes = {
    id: {
      type: Schema.Types.ObjectId,
      unique: true,
      index: true,
    },
    test: {
      type: Schema.Types.String,
    },
  };

  protected options = { strict: false, id: true, versionKey: false };
}
