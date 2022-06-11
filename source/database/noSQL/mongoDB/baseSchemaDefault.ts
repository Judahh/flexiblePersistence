/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Default, IDefault } from '@flexiblepersistence/default-initializer';
import {
  SchemaDefinition,
  SchemaOptions,
  IndexDefinition,
  IndexOptions,
  PipelineStage,
  AggregateOptions,
} from 'mongoose';
import { Populate } from './populate';
import { ToCast } from './toCast';
import { Virtual } from './virtual';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BaseSchemaDefault extends Default {
  protected attributes: SchemaDefinition = {};
  protected options: SchemaOptions = {};
  protected index?: IndexDefinition;
  protected indexOptions?: IndexOptions;
  protected virtual?: Virtual;
  protected populate?: Populate;
  protected pipeline?: PipelineStage[];
  protected pipelineOptions?: AggregateOptions;
  protected toCast?: ToCast;

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

  getPipelineOptions(): AggregateOptions | undefined {
    return this.pipelineOptions;
  }

  getVirtual(): Virtual | undefined {
    return this.virtual;
  }

  getPopulate(): Populate | undefined {
    return this.populate;
  }

  getToCast(): ToCast | undefined {
    return this.toCast;
  }

  getPipeline(): PipelineStage[] | undefined {
    return this.pipeline;
  }

  constructor(initDefault?: IDefault) {
    super(initDefault);
  }
  init(initDefault?: IDefault): void {
    super.init(initDefault);
  }
}
