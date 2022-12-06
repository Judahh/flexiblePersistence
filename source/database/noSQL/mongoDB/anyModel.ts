import { Model, ResolveSchemaOptions, Schema } from 'mongoose';
type AnyModel = Model<
  { [x: string]: any },
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  Schema<
    any,
    Model<any, any, any, any, any>,
    Record<string, unknown>,
    Record<string, unknown>,
    any,
    Record<string, unknown>,
    ResolveSchemaOptions<'type'>,
    { [x: string]: any }
  >
>;

export type { AnyModel };
