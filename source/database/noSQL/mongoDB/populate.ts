export type Read =
  | {
      array?: unknown[];
      item?:
        | {
            byfilter?: unknown[];
            byId?: unknown[];
          }
        | unknown[];
    }
  | unknown[];

export type Create =
  | {
      array?: unknown[];
      item?: unknown[];
    }
  | unknown[];
export type Populate =
  | {
      create?: Create;
      read?: Read;
      update?: Create;
      delete?: Read;
    }
  | unknown[];
