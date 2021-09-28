/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Default, IDefault } from '@flexiblepersistence/default-initializer';
import { SchemaDefinition, SchemaOptions } from 'mongoose';
import { settings } from 'ts-mixer';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BaseSchemaDefault extends Default {
  protected attributes: SchemaDefinition = {};
  protected options: SchemaOptions = {};
  protected indexOptions?: unknown | boolean | string;

  getAttributes(): SchemaDefinition {
    return this.attributes;
  }

  getOptions(): SchemaOptions {
    return this.options;
  }

  getIndexOptions(): unknown | boolean | string {
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
