export type Virtual = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: { get?: () => any; set?: (value: any) => void };
};
