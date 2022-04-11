export type Read =
  | {
      array?: string[];
      item?:
        | {
            filter?: string[];
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
export interface Populate {
  create?: Create;
  read?: Read;
  update?: Create;
  delete?: Read;
}
