/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
export interface IInputDirectedCreate<Item> {
  single?: boolean;
  item: Item | Item[];
  options?: any;
  additionalOptions?: any;
  eventOptions?: any;
}
