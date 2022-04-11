export type Read =
  | {
      array?: string[];
      item?:
        | {
            byfilter?: string[];
            byId?: string[];
          }
        | string[];
    }
  | string[];

export type Create =
  | {
      array?: string[];
      item?: string[];
    }
  | string[];
export type Populate =
  | {
      create?: Create;
      read?: Read;
      update?: Create;
      delete?: Read;
    }
  | string[];
