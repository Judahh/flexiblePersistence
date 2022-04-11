/* eslint-disable no-unused-vars */
export enum CastType {
  JSON,
  OBJECT,
  NONE,
}
export type Read =
  | {
      array?: CastType;
      item?:
        | {
            filter?: CastType;
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
export interface ToCast {
  create?: Create;
  read?: Read;
  update?: Create;
  delete?: Read;
}
