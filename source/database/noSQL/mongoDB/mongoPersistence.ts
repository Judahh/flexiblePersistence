import {
  Model,
  Schema,
  Mongoose,
  QueryOptions,
  Document,
  InsertManyResult,
} from 'mongoose';
import { IPersistence } from '../../../iPersistence/iPersistence';
import { PersistenceInfo } from '../../persistenceInfo';
import { IOutput } from '../../../iPersistence/output/iOutput';
import { Event } from '../../../event/event';

import {
  IInputUpdate,
  IInputDelete,
  IInputCreate,
  IInputRead,
  IInput,
} from '../../..';
import BaseSchemaDefault from './baseSchemaDefault';
import GenericSchema from './genericSchema';
import { IOptions } from '../../../event/iOptions';
export class MongoPersistence implements IPersistence {
  protected persistenceInfo: PersistenceInfo;
  protected mongooseInstance: Mongoose;
  element: {
    [name: string]: BaseSchemaDefault;
  } = { Generic: new GenericSchema() };

  constructor(
    persistenceInfo: PersistenceInfo,
    element?: {
      [name: string]: BaseSchemaDefault;
    }
  ) {
    this.persistenceInfo = persistenceInfo;

    this.mongooseInstance = new Mongoose();
    const uri =
      (!persistenceInfo.connectionType ? 'mongodb://' : '') +
      persistenceInfo.uri;

    this.mongooseInstance.set('toJSON', {
      virtuals: true,
      transform: (doc, converted) => {
        delete converted._id;
      },
    });

    this.mongooseInstance.connect(uri, {
      autoIndex: false,
    });

    this.setElement(element);
  }

  protected initElement(): void {
    for (const key in this.element) {
      if (Object.prototype.hasOwnProperty.call(this.element, key)) {
        const element: BaseSchemaDefault = this.element[key];
        const schema = new this.mongooseInstance.Schema(
          element.getAttributes(),
          element.getOptions()
        );
        const index = element.getIndex();
        if (index) {
          schema.index(index, element.getIndexOptions());
        }
        this.addModel(element.getName(), schema);
      }
    }
    // console.log('Mongoose Models:', this.getModels());
  }

  setElement(element?: { [name: string]: BaseSchemaDefault }): void {
    if (element) this.element = { ...this.element, ...element };
    this.initElement();
  }

  getModel(name: string): Model<unknown, unknown, unknown, unknown> {
    if (this.getModels()[name]) return this.getModels()[name];
    return this.getModels()['Generic'];
  }

  getModels(): { [index: string]: Model<unknown, unknown, unknown, unknown> } {
    return this.mongooseInstance.models;
  }

  addModel(
    name: string,
    schema: Schema
  ): Model<unknown, unknown, unknown, unknown> {
    // this.model[name] =
    return this.mongooseInstance.model(name, schema);
  }

  protected clearModel(model: Model<unknown>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      model.deleteMany({}, undefined, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
  clear(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const responses: Array<Promise<boolean>> = [];
      for (const key in this.getModels()) {
        if (Object.prototype.hasOwnProperty.call(this.getModels(), key)) {
          const model = this.getModel(key);
          responses.push(this.clearModel(model));
        }
      }
      const response = await Promise.all(responses);

      for (const element of response) {
        if (!element) {
          reject(response);
          return;
        }
      }
      resolve(true);
    });
  }

  other(input: IInput<Event>): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve) => {
      resolve({
        receivedItem: input,
      });
    });
  }

  create(input: IInputCreate<Event>): Promise<IOutput<unknown, unknown>> {
    const isRegularArray = Array.isArray(input.item);
    const isContentArray = isRegularArray
      ? false
      : Array.isArray((input.item as Event).content);
    const isArray = isContentArray || isRegularArray;
    input.single =
      input.single === undefined || input.single === null ? true : input.single;
    // console.log('Input Item:', input.item);
    // console.log('Is Array:', isArray);
    // console.log('Is Content Array:', isRegularArray);
    // console.log('Is Regular Array:', isContentArray);
    // console.log('Is single:', input.single);

    const isEvent = input.item instanceof Event;

    if ((input.single && !isArray) || isEvent) {
      return this.createItem(input.scheme, input.item as Event);
    } else {
      return this.createArray(
        input.scheme,
        input.item,
        isRegularArray,
        input.options
      );
    }
  }
  update(input: IInputUpdate<Event>): Promise<IOutput<unknown, unknown>> {
    const isRegularArray = Array.isArray(input.item);
    const isContentArray = isRegularArray
      ? false
      : Array.isArray((input.item as Event).content);
    const isArray = isContentArray || isRegularArray;
    // console.log('Input:', input);

    if ((input.single || input.id && !Array.isArray(input.id)) && !isArray) {
      return this.updateItem(
        input.scheme,
        input.selectedItem,
        input.item as Event,
        input.options
      );
    } else {
      return this.updateArray(
        input.scheme,
        input.selectedItem,
        input.item,
        isRegularArray,
        input.options
      );
    }
  }
  read(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    if (input.single || input.id && !Array.isArray(input.id)) {
      if (input.id)
        return this.readItemById(
          input.scheme,
          input.id,
          input.options,
          input.additionalOptions,
          input.eventOptions
        );
      return this.readItem(
        input.scheme,
        input.selectedItem,
        input.options,
        input.additionalOptions,
        input.eventOptions
      );
    } else {
      return this.readArray(
        input.scheme,
        input.selectedItem,
        input.options,
        input.additionalOptions,
        input.eventOptions
      );
    }
  }
  delete(input: IInputDelete): Promise<IOutput<unknown, unknown>> {
    if (input.single || input.id && !Array.isArray(input.id)) {
      if (input.id)
        return this.deleteItemById(input.scheme, input.id, input.options);
      return this.deleteItem(input.scheme, input.selectedItem, input.options);
    } else {
      return this.deleteArray(input.scheme, input.selectedItem, input.options);
    }
  }

  async findOneAndUpdateResult(
    // eslint-disable-next-line no-unused-vars
    resolve: (_value?) => void,
    // eslint-disable-next-line no-unused-vars
    reject: (_reason?) => void,
    error: unknown,
    doc: Document,
    result: unknown
  ): Promise<void> {
    if (error) {
      reject(error);
    } else {
      const item = {
        receivedItem: this.generateReceivedItem(doc),
        result: result ? { doc, result } : doc,
      };
      resolve(item);
    }
  }
  async findOneAndUpdate(
    model: Model<unknown>,
    selectedItem: Event,
    item: Event,
    options?: QueryOptions
  ): Promise<{ receivedItem: unknown; result: unknown }> {
    return new Promise<{ receivedItem: unknown; result: unknown }>(
      async (resolve, reject) => {
        delete item.id;
        delete item._id;
        const id = selectedItem?.id || selectedItem?._id;

        if (id) {
          model.findByIdAndUpdate(
            id,
            item,
            { new: true, ...options },
            (error, doc, result) => {
              this.findOneAndUpdateResult(
                resolve,
                reject,
                error,
                doc as Document,
                result
              );
            }
          );
        } else {
          model.findOneAndUpdate(
            selectedItem,
            item,
            options,
            (error, doc, result) => {
              this.findOneAndUpdateResult(
                resolve,
                reject,
                error,
                doc as Document,
                result
              );
            }
          );
        }
      }
    );
  }
  updateArray(
    scheme: string,
    selectedItem?: Record<string, unknown>,
    item?: Event | Event[],
    regular?: boolean,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>(async (resolve, reject) => {
      const model = this.getModel(scheme);
      const newItem = Array.isArray(item)
        ? this.generateNewArray(item, regular)
        : this.generateNewItem(item);

      if (Array.isArray(newItem)) {
        // console.log('newItem Array:', newItem);

        const promisedResponses: Array<Promise<IOutput<unknown, unknown>>> = [];
        for (let index = 0; index < newItem.length; index++) {
          const newItemElement = newItem[index];

          const selectedItemElement = Array.isArray(selectedItem)
            ? selectedItem[index]
            : {
                id: newItemElement.id,
                _id: newItemElement._id,
                ...selectedItem,
              };

          // delete newItemElement.id;
          // delete newItemElement._id;

          // console.log(
          //   '-selectedItemElement:',
          //   selectedItemElement,
          //   newItemElement
          // );

          promisedResponses.push(
            this.findOneAndUpdate(
              model,
              selectedItemElement,
              newItemElement,
              options
            )
          );
        }
        const responses = await Promise.all(promisedResponses);
        // console.log('responses:', responses);

        resolve(
          this.cleanReceived({
            receivedItem: responses.map((response) => response.receivedItem),
            result: responses.map((response) => response.result),
            selectedItem: selectedItem,
            sentItem: item,
          })
        );
      } else {
        // console.log('newItem:', newItem);
        model.updateMany(selectedItem, newItem, options, (error, doc) => {
          if (error) {
            reject(error);
          } else {
            resolve(
              this.cleanReceived({
                receivedItem: this.generateReceivedItem(doc),
                result: doc,
                selectedItem: selectedItem,
                sentItem: item,
              })
            );
          }
        });
      }
    });
  }

  protected cleanReceived(received: {
    receivedItem?;
    result?;
    selectedItem?;
    sentItem?;
  }): {
    receivedItem?;
    result?;
    selectedItem?;
    sentItem?;
  } {
    if (received.receivedItem === undefined || received.receivedItem === null) {
      delete received.receivedItem;
    }
    if (received.result === undefined || received.result === null) {
      delete received.result;
    }
    if (received.selectedItem === undefined || received.selectedItem === null) {
      delete received.selectedItem;
    }
    if (received.sentItem === undefined || received.sentItem === null) {
      delete received.sentItem;
    }
    return received;
  }

  async updateItem(
    scheme: string,
    selectedItem?: Event,
    item?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>(async (resolve) => {
      const model = this.getModel(scheme);
      const newItem = this.generateNewItem(item);
      const newSelectedItem = this.generateNewItem(selectedItem);
      const response = await this.findOneAndUpdate(
        model,
        newSelectedItem,
        newItem,
        options
      );
      resolve(
        this.cleanReceived({
          ...response,
          selectedItem: selectedItem,
          sentItem: item,
        })
      );
    });
  }

  generateOptions(options?: QueryOptions, eventOptions?: IOptions) {
    if (eventOptions?.pageSize || eventOptions?.pageSize) {
      const pageSize = eventOptions?.pageSize || eventOptions?.pagesize;
      const skip =
        eventOptions?.page && pageSize ? +eventOptions?.page * +pageSize : 0;
      const compiledOptions = {
        ...options,
        limit: pageSize ? +pageSize : undefined,
        skip: skip ? +skip : undefined,
      };
      return compiledOptions;
    }
    return options;
  }

  async count(
    model: Model<unknown, unknown, unknown, unknown>,
    selectedItem: Event,
    options?: QueryOptions,
    eventOptions?: IOptions,
    compiledOptions?: QueryOptions
  ): Promise<void> {
    if (compiledOptions && compiledOptions.limit) {
      const count = await model.countDocuments(selectedItem, options);
      if (eventOptions) {
        eventOptions.pages = Math.ceil(count / compiledOptions.limit);
      }
    }
  }

  readArray(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions,
    additionalOptions?: unknown,
    eventOptions?: IOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const compiledOptions = this.generateOptions(options, eventOptions);
      const model = this.getModel(scheme);
      const newSelectedItem = this.generateNewItem(selectedItem);
      model.find(
        newSelectedItem,
        additionalOptions,
        compiledOptions,
        async (error, docs: Document[]) => {
          if (error) {
            reject(error);
          } else {
            await this.count(
              model,
              newSelectedItem,
              options,
              eventOptions,
              compiledOptions
            );
            resolve(
              this.cleanReceived({
                receivedItem: this.generateReceivedArray(docs),
                result: docs,
                selectedItem: selectedItem,
              })
            );
          }
        }
      );
    });
  }

  readItem(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions,
    additionalOptions?: unknown,
    eventOptions?: IOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const compiledOptions = this.generateOptions(options, eventOptions);
      const model = this.getModel(scheme);
      const newSelectedItem = this.generateNewItem(selectedItem);
      model.findOne(
        newSelectedItem,
        additionalOptions,
        compiledOptions,
        async (error, doc) => {
          if (error) {
            reject(error);
          } else {
            await this.count(
              model,
              newSelectedItem,
              options,
              eventOptions,
              compiledOptions
            );
            resolve(
              this.cleanReceived({
                receivedItem: this.generateReceivedItem(doc),
                result: doc,
                selectedItem,
              })
            );
          }
        }
      );
    });
  }

  readItemById(
    scheme: string,
    id: unknown,
    options?: QueryOptions,
    additionalOptions?: unknown,
    eventOptions?: IOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const compiledOptions = this.generateOptions(options, eventOptions);
      const model = this.getModel(scheme);
      model.findById(
        id,
        additionalOptions,
        compiledOptions,
        async (error, doc) => {
          if (error) {
            reject(error);
          } else {
            await this.count(
              model,
              { id: id } as Event,
              options,
              eventOptions,
              compiledOptions
            );
            resolve(
              this.cleanReceived({
                receivedItem: this.generateReceivedItem(doc),
                result: doc,
                selectedItem: { id: id },
              })
            );
          }
        }
      );
    });
  }

  deleteArray(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const model = this.getModel(scheme);
      const newSelectedItem = this.generateNewItem(selectedItem);
      model.deleteMany(newSelectedItem, options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived({
              selectedItem,
            })
          );
        }
      });
    });
  }

  protected generateReceivedArray(
    docs: Document[] | Document | InsertManyResult<unknown> | undefined | null
  ): unknown[] {
    let receivedItem;
    if (Array.isArray(docs))
      receivedItem = docs.map((doc) => this.generateReceivedItem(doc));
    else receivedItem = this.generateReceivedItem(docs);
    return receivedItem;
  }

  protected generateNewArray(
    item: Event | Event[],
    regular?: boolean
  ): Event | Event[] {
    let items: Event | Event[] = item;
    if (!Array.isArray(item) && item.content && Array.isArray(item.content)) {
      if (regular)
        items = item?.content?.map((itemC) => this.generateNewItem(itemC));
      else
        items = item?.content?.map((itemC: { id?: unknown }) =>
          this.generateNewItem({ ...item, content: itemC, id: itemC.id })
        );
    } else if (Array.isArray(item)) {
      items = item.map((itemC) => this.generateNewItem(itemC));
    }
    return items;
  }

  protected generateNewItem(item?: Event | { id?: unknown }): Event {
    if (item && item.id) {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem._id = newItem.id;
      return newItem;
    }
    return item as Event;
  }

  protected generateReceivedItem(
    doc:
      | Document<unknown, unknown, unknown>
      | InsertManyResult<unknown>
      | undefined
      | null
  ): unknown {
    const receivedItem =
      doc === undefined || doc === null
        ? undefined
        : doc['_doc']
        ? doc['_doc']
        : doc['value']
        ? doc['value']
        : doc;
    if (receivedItem && receivedItem._id) {
      if (!receivedItem.id) receivedItem.id = receivedItem._id;
      delete receivedItem._id;
    }
    return receivedItem;
  }

  createItem(scheme: string, item: Event): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const model = this.getModel(scheme);
      const newItem = this.generateNewItem(item);
      model.create(newItem, (error, doc) => {
        // console.log('Scheme:', scheme, item, newItem);
        if (error) {
          // console.error('error:', error);
          reject(error);
        } else {
          // console.log('doc:', doc);
          resolve(
            this.cleanReceived({
              receivedItem: this.generateReceivedItem(doc),
              result: doc,
              sentItem: item,
            })
          );
        }
      });
    });
  }

  async createArray(
    scheme: string,
    item: Event | Event[],
    regular: boolean,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    const items = this.generateNewArray(item, regular);

    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const model = this.getModel(scheme);
      model.insertMany(items, options, (error, docs) => {
        // console.log('Scheme ARRAY:', scheme, item, items);
        if (error) {
          // console.error('error:', error);
          reject(error);
        } else {
          // console.log('docs:', docs);
          const receivedItem = this.generateReceivedArray(docs);
          resolve(
            this.cleanReceived({
              receivedItem: receivedItem,
              result: docs,
              sentItem: item,
            })
          );
        }
      });
    });
  }

  deleteItem(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const model = this.getModel(scheme);
      const newSelectedItem = this.generateNewItem(selectedItem);
      model.findOneAndDelete(newSelectedItem, options, (error, doc) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived({
              receivedItem: this.generateReceivedItem(doc),
              result: doc,
              selectedItem: selectedItem,
            })
          );
        }
      });
    });
  }

  deleteItemById(
    scheme: string,
    id: unknown,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const model = this.getModel(scheme);
      model.findByIdAndDelete(id, options, (error, doc) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived({
              receivedItem: this.generateReceivedItem(doc),
              result: doc,
              selectedItem: { id: id },
            })
          );
        }
      });
    });
  }

  getPersistenceInfo(): PersistenceInfo {
    return this.persistenceInfo;
  }

  close(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.mongooseInstance.connection.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}
