/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOutput<Filter, Input, Output> {
  receivedItem?: Output;
  result?: any;
  selectedItem?: Filter;
  sentItem?: Input;
}
