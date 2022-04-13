export type Virtual = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: { get?: () => unknown; set?: (value: unknown) => void };
};
