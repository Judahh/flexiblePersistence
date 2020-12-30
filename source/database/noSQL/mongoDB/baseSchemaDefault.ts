/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Default,
  DefaultInitializer,
} from '@flexiblepersistence/default-initializer';
import { SchemaDefinition, SchemaOptions } from 'mongoose';
import { settings } from 'ts-mixer';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BaseSchemaDefault extends Default {
  protected attributes: SchemaDefinition = {};
  protected options: SchemaOptions = {};
  protected indexOptions?: any | boolean | string;

  getAttributes(): SchemaDefinition {
    return this.attributes;
  }

  getOptions(): SchemaOptions {
    return this.options;
  }

  getIndexOptions(): any | boolean | string {
    return this.indexOptions;
  }
  constructor(initDefault?: DefaultInitializer) {
    super(initDefault);
  }
  init(initDefault?: DefaultInitializer): void {
    // console.log('init:', initDefault);

    super.init(initDefault);
  }
}
