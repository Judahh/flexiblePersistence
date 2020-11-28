/* eslint-disable @typescript-eslint/no-explicit-any */
export class PersistencePromise<Output> {
  receivedItem: Output;
  result: any;
  selectedItem: any;
  sentItem: any;

  constructor({
    receivedItem,
    result,
    selectedItem,
    sentItem,
  }: {
    receivedItem?: any;
    result?: any;
    selectedItem?: any;
    sentItem?: any;
  }) {
    this.receivedItem = receivedItem;
    this.result = result;
    this.selectedItem = selectedItem;
    this.sentItem = sentItem;
  }
}
