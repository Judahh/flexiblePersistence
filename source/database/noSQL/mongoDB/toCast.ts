/* eslint-disable no-unused-vars */
export enum CastType {
  toJSON,
  toObject,
  none,
}
export type Read =
  | {
      array?: CastType;
      item?:
        | {
            byfilter?: CastType;
            byId?: CastType;
          }
        | CastType;
    }
  | CastType;

export type Create =
  | {
      array?: CastType;
      item?: CastType;
    }
  | CastType;
export type ToCast =
  | {
      create?: Create;
      read?: Read;
      update?: Create;
      delete?: Read;
    }
  | CastType;
