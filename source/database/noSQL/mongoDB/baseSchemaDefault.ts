/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Default, IDefault } from '@flexiblepersistence/default-initializer';
import { SchemaDefinition, SchemaOptions, IndexDefinition, IndexOptions } from 'mongoose';
import { settings } from 'ts-mixer';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BaseSchemaDefault extends Default {
  protected attributes: SchemaDefinition = {};
  protected options: SchemaOptions = {};
  protected index?: IndexDefinition;
  protected indexOptions?: IndexOptions;

  getAttributes(): SchemaDefinition {
    return this.attributes;
  }

  getOptions(): SchemaOptions {
    return this.options;
  }

  getIndex(): IndexDefinition | undefined {
    return this.index;
  }

  getIndexOptions(): IndexOptions | undefined {
    return this.indexOptions;
  }
  constructor(initDefault?: IDefault) {
    super(initDefault);
  }
  init(initDefault?: IDefault): void {
    // console.log('init:', initDefault);

    super.init(initDefault);
  }
}
