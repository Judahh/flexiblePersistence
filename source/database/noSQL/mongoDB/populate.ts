import { PopulateOptions } from 'mongoose';

export type Read =
  | {
      array?: (string | PopulateOptions)[] | string | PopulateOptions;
      item?:
        | {
            byfilter?: (string | PopulateOptions)[] | string | PopulateOptions;
            byId?: (string | PopulateOptions)[] | string | PopulateOptions;
          }
        | (string | PopulateOptions)[]
        | string
        | PopulateOptions;
    }
  | (string | PopulateOptions)[]
  | string
  | PopulateOptions;

export type Create =
  | {
      array?: (string | PopulateOptions)[] | string | PopulateOptions;
      item?: (string | PopulateOptions)[] | string | PopulateOptions;
    }
  | (string | PopulateOptions)[]
  | string
  | PopulateOptions;
export type Populate =
  | {
      create?: Create;
      read?: Read;
      update?: Create;
      delete?: Read;
    }
  | (string | PopulateOptions)[]
  | string
  | PopulateOptions;
