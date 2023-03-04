import {
  Model,
  ResolveSchemaOptions,
  Schema,
  // Document,
  // HydratedDocument,
  // InferSchemaType,
  // ObtainSchemaGeneric,
} from 'mongoose';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyModel<TSchema = any> = Model<
//   InferSchemaType<TSchema>,
//   ObtainSchemaGeneric<TSchema, 'TQueryHelpers'>,
//   ObtainSchemaGeneric<TSchema, 'TInstanceMethods'>,
//   ObtainSchemaGeneric<TSchema, 'TVirtuals'>,
//   HydratedDocument<
//     InferSchemaType<TSchema>,
//     ObtainSchemaGeneric<TSchema, 'TVirtuals'> &
//       ObtainSchemaGeneric<TSchema, 'TInstanceMethods'>,
//     ObtainSchemaGeneric<TSchema, 'TQueryHelpers'>
//   >,
//   TSchema
// > &
//   ObtainSchemaGeneric<TSchema, 'TStaticMethods'>;

export type { AnyModel };
