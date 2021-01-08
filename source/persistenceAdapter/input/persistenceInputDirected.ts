/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
export interface PersistenceInputDirected<Item> {
  single?: boolean;
  selectedItem?: any;
  options?: any;
  additionalOptions?: any;
  eventOptions?: any;
  id?: any;
  item?: Item | Item[];
}
