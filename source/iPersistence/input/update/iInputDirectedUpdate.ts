/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
export interface IInputDirectedUpdate<Item> {
  single?: boolean;
  selectedItem?: any;
  options?: any;
  additionalOptions?: any;
  eventOptions?: any;
  id?: any;
  item: Item | Item[];
  correct: boolean;
  replace?: boolean; // only for create/update/other
}
