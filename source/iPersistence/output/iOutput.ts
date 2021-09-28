/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOutput<Input, Output> {
  receivedItem?: Output;
  result?: any;
  selectedItem?: any;
  sentItem?: Input;
}
