/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export type Virtual = {
  [key: string]: {
    get?: (value?: any, virtual?: any, doc?: any) => any;
    set?: (value?: any, virtual?: any, doc?: any) => any;
  };
};
