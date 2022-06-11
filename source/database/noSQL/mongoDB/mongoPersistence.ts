/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Model,
  Schema,
  Mongoose,
  QueryOptions,
  Document,
  InsertManyResult,
  PipelineStage,
  AnyObject,
  PopulateOptions,
  AggregateOptions,
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
  Operation,
  Populate,
} from '../../..';
import BaseSchemaDefault from './baseSchemaDefault';
import GenericSchema from './genericSchema';
import { IOptions } from '../../../event/iOptions';
import { Type } from '../../../event/type';
import { SubType } from '../../../event/subType';
import { CastType, ToCast } from './toCast';
import { FullOperation } from '../../../event/fullOperation';
import { ObjectId } from 'mongodb';
import { PipelineCRUD, PipelineCRUDType } from './pipelineCRUD';
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
        const virtual = element.getVirtual();
        const populate = element.getPopulate();
        const pipeline = element.getPipeline();
        const pipelineOptions = element.getPipelineOptions();
        const toCast = element.getToCast();
        if (index) {
          schema.index(index, element.getIndexOptions());
        }
        if (virtual) {
          for (const key in virtual) {
            if (Object.hasOwnProperty.call(virtual, key)) {
              const element = virtual[key];
              const currentVirtual = schema.virtual(key, element);
              if (element)
                for (const key in element) {
                  if (Object.hasOwnProperty.call(element, key)) {
                    const element2 = element[key];
                    if (currentVirtual[key] instanceof Function) {
                      currentVirtual[key](element2);
                    } else {
                      currentVirtual[key] = element2;
                    }
                  }
                }
            }
          }
          schema['virtualOptions'] = virtual;
        }
        if (populate) {
          schema['populateOptions'] = populate;
        }
        if (toCast) {
          schema['toCastOptions'] = toCast;
        }
        if (pipeline) {
          schema['pipeline'] = pipeline;
        }
        if (pipelineOptions) {
          schema['pipelineOptions'] = pipelineOptions;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.addModel(element?.getName(), schema);
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

  protected populateStep(
    query,
    populateOptions: (string | PopulateOptions)[] | string | PopulateOptions,
    populate,
    callback
  ) {
    if (Array.isArray(populateOptions))
      for (const populateOption of populateOptions) {
        console.log('populate:', populateOption);
        if (populate) query = query.populate(populate, populateOption);
        else query = query.populate(populateOption);
      }
    else query = query.populate(populate);
    query.exec(callback);
    return query;
  }

  protected getCrud(method: string): PipelineCRUDType {
    switch (method) {
      case 'create':
      case 'insertMany':
        return PipelineCRUDType.create;
      case 'find':
      case 'findOne':
      case 'findById':
        return PipelineCRUDType.read;
      case 'updateMany':
      case 'findOneAndUpdate':
      case 'findByIdAndUpdate':
        return PipelineCRUDType.update;
      case 'deleteMany':
      case 'findOneAnddelete':
      case 'findByIdAndDelete':
        return PipelineCRUDType.delete;
    }
    return PipelineCRUDType.read;
  }

  protected isPipelineCrud(
    pipeline: PipelineStage | PipelineStage[] | PipelineCRUD | undefined
  ): boolean {
    let isPipeline =
      pipeline &&
      !Array.isArray(pipeline) &&
      // @ts-ignore
      (pipeline.create !== undefined ||
        // @ts-ignore
        pipeline.read !== undefined ||
        // @ts-ignore
        pipeline.update !== undefined ||
        // @ts-ignore
        pipeline.delete !== undefined);
    isPipeline = isPipeline || false;
    return isPipeline;
  }

  protected populate(
    scheme: string,
    method: string,
    queryParams: unknown[],
    populateOptions: (string | PopulateOptions)[] | string | PopulateOptions,
    callback?
  ) {
    const model = this.getModel(scheme);
    const crud = this.getCrud(method);
    model.aggregate();
    let pipeline: PipelineStage | PipelineStage[] | PipelineCRUD | undefined =
      model.schema['pipeline'];
    pipeline = (this.isPipelineCrud(pipeline) ? pipeline?.[crud] : pipeline) as
      | PipelineStage
      | PipelineStage[]
      | undefined;
    const pipelineOptions: AggregateOptions | undefined =
      model.schema['pipelineOptions'];
    const hasPopulate =
      populateOptions !== undefined &&
      populateOptions !== null &&
      Array.isArray(populateOptions)
        ? populateOptions.length > 0
        : true;
    const hasPipeline = pipeline !== undefined && pipeline !== null;
    let query: any = undefined;
    model.collection.collectionName;
    if (hasPipeline) {
      let firstParam: AnyObject | ObjectId | string | number =
        queryParams?.[0] as AnyObject | ObjectId | string | number;
      firstParam = (
        typeof firstParam === 'string' ||
        typeof firstParam === 'number' ||
        firstParam instanceof ObjectId
          ? { id: firstParam }
          : firstParam
      ) as AnyObject;
      const secondParam: Record<string, any> = queryParams?.[1] as Record<
        string,
        any
      >;
      //! missing: const thirdParam = queryParams?.[2];
      const queryPipeline: PipelineStage[] = [{ $match: firstParam }];

      switch (crud) {
        case PipelineCRUDType.create:
          queryPipeline.push({
            $merge: {
              into: model.collection.collectionName,
              on: 'id',
              whenMatched: 'fail',
              whenNotMatched: 'insert',
            },
          });
          break;

        case PipelineCRUDType.update:
          queryPipeline.push({
            $merge: {
              into: model.collection.collectionName,
              on: Object.keys(firstParam),
              let: secondParam,
              whenMatched: 'replace',
              whenNotMatched: 'fail',
            },
          });
          break;
      }

      pipeline = Array.isArray(pipeline)
        ? [...pipeline, ...queryPipeline]
        : pipeline
        ? [pipeline, ...queryPipeline]
        : queryPipeline;
      if (
        method === 'deleteMany' ||
        method === 'findOneAndDelete' ||
        method === 'findByIdAndDelete'
      ) {
        //@ts-ignore
        query = model.aggregate(pipeline, pipelineOptions).then((result) => {
          const queryIds = result.map((doc) => doc._id);
          query = model.deleteMany(
            { _id: { $in: queryIds } },
            secondParam,
            (...params) => {
              if (hasPopulate)
                query = this.populateStep(
                  model,
                  populateOptions,
                  params[0],
                  callback
                );
              else query = callback(...params);
            }
          );
        }, callback);
      } else {
        //@ts-ignore
        query = model.aggregate(pipeline, pipelineOptions, (...params) => {
          if (hasPopulate)
            query = this.populateStep(
              model,
              populateOptions,
              params[0],
              callback
            );
          else query = callback(...params);
        });
      }
    } else {
      query = model?.[method]?.bind(model);
      if (hasPopulate) {
        query = query?.(...queryParams);
        console.log('populate:', query, query.name, queryParams);
        query = this.populateStep(query, populateOptions, undefined, callback);
      } else {
        query = query(...queryParams, callback);
      }
    }
    return query;
  }
  protected populateAll(
    scheme: string,
    method: string, //query (model[method].bind(model)) => model.create.bind(model)
    queryParams?: unknown[],
    fullOperation?: FullOperation,
    // eslint-disable-next-line no-unused-vars
    callback?: (..._params) => void
  ) {
    queryParams = this.filterQueryParams(queryParams);
    const model = this.getModel(scheme);
    const populate = model.schema['populateOptions'] as Populate | undefined;

    // console.log('populateAll:', queryParams);
    if (populate) {
      if (Array.isArray(populate)) {
        return this.populate(scheme, method, queryParams, populate, callback);
      } else if (fullOperation?.operation !== undefined) {
        const operation = Operation[fullOperation?.operation];
        const hasOparation = operation !== undefined && operation !== null;
        const populateOpertaion = hasOparation
          ? populate[operation]
          : undefined;
        const hasPopulateOparation =
          populateOpertaion !== undefined && populateOpertaion !== null;
        if (hasPopulateOparation) {
          if (Array.isArray(populateOpertaion)) {
            return this.populate(
              scheme,
              method,
              queryParams,
              populateOpertaion,
              callback
            );
          } else if (fullOperation?.type !== undefined) {
            const type = Type[fullOperation?.type];
            const hasType = type !== undefined && type !== null;
            const populateType = hasType ? populateOpertaion[type] : undefined;
            const hasPopulateType =
              populateType !== undefined && populateType !== null;
            if (hasPopulateType) {
              if (Array.isArray(populateType)) {
                return this.populate(
                  scheme,
                  method,
                  queryParams,
                  populateType,
                  callback
                );
              } else if (fullOperation?.subType !== undefined) {
                const subType = SubType[fullOperation?.subType];
                const hasSubType = subType !== undefined && subType !== null;
                const populateSubType = hasSubType
                  ? populateType[subType]
                  : undefined;
                const hasPopulateSubType =
                  populateSubType !== undefined && populateSubType !== null;
                if (hasPopulateSubType && Array.isArray(populateSubType)) {
                  return this.populate(
                    scheme,
                    method,
                    queryParams,
                    populateSubType,
                    callback
                  );
                }
              }
            }
          }
        }
      }
    }
    return this.populate(scheme, method, queryParams, [], callback);
  }

  protected execute(query, queryParams, callback?) {
    queryParams = this.filterQueryParams(queryParams);
    const hasCallback = callback !== undefined && callback !== null;
    // console.log('execute:', queryParams);
    if (typeof query !== 'function') {
      if (query.exec !== undefined) {
        return hasCallback ? query.exec(callback) : query(queryParams);
      }
      return query;
    } else if (typeof query === 'function') {
      try {
        if (queryParams.length > 0)
          return hasCallback
            ? query(...queryParams, callback)
            : query(...queryParams);
        return query({}, callback);
      } catch (error) {
        const functionQuery =
          queryParams.length > 0 ? query(...queryParams) : query();
        if (typeof functionQuery.exec !== undefined && hasCallback) {
          return functionQuery.exec(callback);
        } else {
          return functionQuery;
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected advancedFilter(queryParams?: any[]): void {
    if (
      queryParams !== undefined &&
      queryParams !== null &&
      queryParams.length > 0
    )
      for (const element of queryParams) {
        if (element !== undefined && element !== null) {
          for (const key in element) {
            if (
              key !== undefined &&
              key !== null &&
              element[key] !== undefined &&
              element[key] !== null
            ) {
              let isArray = false;
              if (key.includes('[]')) {
                const keySplit = key.split('[]');
                element[keySplit[0]] = element[key];
                delete element[key];
                isArray = true;
              }
              if (key.includes('.$')) {
                const keySplit = key.split('.$');
                if (
                  element[keySplit[0]] === undefined ||
                  element[keySplit[0]] === null
                )
                  element[keySplit[0]] = {};
                let newKey = '$' + keySplit[1];
                if (
                  (isArray || Array.isArray(element[key])) &&
                  keySplit[1] === 'ne'
                ) {
                  newKey = '$nin';
                }
                element[keySplit[0]][newKey] = element[key];
                delete element[key];
              }
            }
          }
        }
      }
  }

  protected filterQueryParams(queryParams?: unknown[]) {
    if (
      queryParams !== undefined &&
      queryParams !== null &&
      queryParams.length > 0
    )
      for (
        let index = queryParams.length - 1;
        index >= 0 && queryParams[index] === undefined;
        index--
      ) {
        queryParams.splice(index, 1);
      }
    else queryParams = [];
    this.advancedFilter.bind(this)(queryParams);
    return queryParams;
  }

  protected toCast(type: CastType): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = CastType[type];
    return value === 'none' ||
      value === '' ||
      value === undefined ||
      value === null
      ? ''
      : value;
  }

  protected toCastAll(schema: string, fullOperation?: FullOperation): string {
    const model = this.getModel(schema);
    let toCast: ToCast = model.schema['toCastOptions'];

    if (toCast) {
      if (typeof toCast === 'number') {
        return this.toCast(toCast);
      } else {
        if (
          fullOperation?.operation === undefined ||
          fullOperation?.operation === null
        )
          return '';
        const operation = Operation[fullOperation?.operation];
        const hasOperation = operation !== undefined && operation !== null;
        toCast = hasOperation ? toCast[operation] : undefined;
        let hasToCast = toCast !== undefined && toCast !== null;
        if (hasToCast) {
          if (typeof toCast === 'number') {
            return this.toCast(toCast);
          } else {
            if (
              fullOperation?.type === undefined ||
              fullOperation?.type === null
            )
              return '';
            const type = Type[fullOperation?.type];
            const hasType = type !== undefined && type !== null;
            toCast = hasType ? toCast[type] : undefined;
            hasToCast = toCast !== undefined && toCast !== null;
            if (hasToCast) {
              if (typeof toCast === 'number') {
                return this.toCast(toCast);
              } else {
                if (
                  fullOperation?.subType === undefined ||
                  fullOperation?.subType === null
                )
                  return '';
                const subType = SubType[fullOperation?.subType];
                const hasSubType = subType !== undefined && subType !== null;
                toCast = hasSubType ? toCast[subType] : undefined;
                hasToCast = toCast !== undefined && toCast !== null;
                if (hasToCast && typeof toCast === 'number') {
                  return this.toCast(toCast);
                }
              }
            }
          }
        }
      }
    }
    return '';
  }

  protected clearModel(scheme: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const model = this.getModel(scheme);
      model?.deleteMany({}, undefined, (error) => {
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
          responses.push(this.clearModel(key));
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

  read(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    if (input.single || (input.id && !Array.isArray(input.id))) {
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

  update(input: IInputUpdate<Event>): Promise<IOutput<unknown, unknown>> {
    const isRegularArray = Array.isArray(input.item);
    const isContentArray = isRegularArray
      ? false
      : Array.isArray((input.item as Event).content);
    const isArray = isContentArray || isRegularArray;
    // console.log('Input:', input);

    if ((input.single || (input.id && !Array.isArray(input.id))) && !isArray) {
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

  delete(input: IInputDelete): Promise<IOutput<unknown, unknown>> {
    if (input.single || (input.id && !Array.isArray(input.id))) {
      if (input.id)
        return this.deleteItemById(input.scheme, input.id, input.options);
      return this.deleteItem(input.scheme, input.selectedItem, input.options);
    } else {
      return this.deleteArray(input.scheme, input.selectedItem, input.options);
    }
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
    scheme: string,
    selectedItem: Event,
    options?: QueryOptions,
    eventOptions?: IOptions,
    compiledOptions?: QueryOptions
  ): Promise<void> {
    const model = this.getModel(scheme);
    if (compiledOptions && compiledOptions.limit) {
      const count = await model.countDocuments(selectedItem, options);
      if (eventOptions) {
        eventOptions.pages = Math.ceil(count / compiledOptions.limit);
      }
    }
  }

  protected generateReceivedArray(
    docs: Document[] | Document | InsertManyResult<unknown> | undefined | null,
    scheme?: string,
    fullOperation?: FullOperation
  ): unknown[] {
    let receivedItem;
    if (Array.isArray(docs))
      receivedItem = docs.map((doc) =>
        this.generateReceivedItem.bind(this)(doc, scheme, fullOperation)
      );
    else
      receivedItem = this.generateReceivedItem.bind(this)(
        docs,
        scheme,
        fullOperation
      );
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
      | null,
    scheme?: string,
    fullOperation?: FullOperation
  ): unknown {
    const cast =
      scheme !== undefined ? this.toCastAll(scheme, fullOperation) : '';

    let receivedItem =
      doc === undefined || doc === null
        ? undefined
        : doc['_doc']
        ? doc['_doc']
        : doc['value']
        ? doc['value']
        : doc;

    // console.log('Received cast:', cast);

    receivedItem =
      cast !== undefined &&
      cast !== null &&
      cast !== '' &&
      cast !== 'none' &&
      doc !== undefined &&
      doc !== null
        ? doc[cast]()
        : doc;

    if (receivedItem && receivedItem._id) {
      if (!receivedItem.id) receivedItem.id = receivedItem._id;
      delete receivedItem._id;
    }
    return receivedItem;
  }

  createItem(scheme: string, item: Event): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const newItem = this.generateNewItem(item);
      const fullOperation = {
        operation: Operation.create,
        type: Type.item,
        subType: SubType.byFilter,
      };
      const callback = (error, doc) => {
        // console.log('Scheme:', scheme, item, newItem);
        if (error) {
          // console.error('error:', error);
          reject(error);
        } else {
          // console.log('doc:', doc);
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedItem.bind(this)(
                doc,
                scheme,
                fullOperation
              ),
              result: doc,
              sentItem: item,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'create',
        [newItem],
        fullOperation,
        callback.bind(this)
      );
    });
  }

  async createArray(
    scheme: string,
    item: Event | Event[],
    regular: boolean,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    const items = this.generateNewArray(item, regular);
    const fullOperation = {
      operation: Operation.create,
      type: Type.array,
      subType: SubType.byFilter,
    };

    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const callback = (error, docs) => {
        // console.log('Scheme ARRAY:', scheme, item, items);
        if (error) {
          // console.error('error:', error);
          reject(error);
        } else {
          // console.log('docs:', docs);
          const receivedItem = this.generateReceivedArray.bind(this)(
            docs,
            scheme,
            fullOperation
          );
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: receivedItem,
              result: docs,
              sentItem: item,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'insertMany',
        [items, options],
        fullOperation,
        callback.bind(this)
      );
    });
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
      const newSelectedItem = this.generateNewItem(selectedItem);
      const fullOperation = {
        operation: Operation.read,
        type: Type.array,
        subType: SubType.byFilter,
      };
      const callback = async (error, docs: Document[]) => {
        // console.log('Scheme readArray:', scheme);
        if (error) {
          reject(error);
        } else {
          await this.count.bind(this)(
            scheme,
            newSelectedItem,
            options,
            eventOptions,
            compiledOptions
          );
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedArray.bind(this)(
                docs,
                scheme,
                fullOperation
              ),
              result: docs,
              selectedItem: selectedItem,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'find',
        [newSelectedItem, additionalOptions, compiledOptions],
        fullOperation,
        callback.bind(this)
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
      const newSelectedItem = this.generateNewItem(selectedItem);
      const fullOperation = {
        operation: Operation.read,
        type: Type.item,
        subType: SubType.byFilter,
      };
      const callback = async (error, doc) => {
        // console.log('Scheme readArray:', scheme);
        if (error) {
          reject(error);
        } else {
          await this.count.bind(this)(
            scheme,
            newSelectedItem,
            options,
            eventOptions,
            compiledOptions
          );
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedItem.bind(this)(
                doc,
                scheme,
                fullOperation
              ),
              result: doc,
              selectedItem,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'findOne',
        [newSelectedItem, additionalOptions, compiledOptions],
        fullOperation,
        callback.bind(this)
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
      const fullOperation = {
        operation: Operation.read,
        type: Type.item,
        subType: SubType.byId,
      };
      const callback = async (error, doc) => {
        if (error) {
          reject(error);
        } else {
          await this.count.bind(this)(
            scheme,
            { id: id } as Event,
            options,
            eventOptions,
            compiledOptions
          );
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedItem.bind(this)(
                doc,
                scheme,
                fullOperation
              ),
              result: doc,
              selectedItem: { id: id },
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'findById',
        [id, additionalOptions, compiledOptions],
        fullOperation,
        callback.bind(this)
      );
    });
  }

  async updateItem(
    scheme: string,
    selectedItem?: Event,
    item?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>(async (resolve) => {
      const newItem = this.generateNewItem(item);
      const newSelectedItem = this.generateNewItem(selectedItem);
      const response = await this.findOneAndUpdate.bind(this)(
        scheme,
        newSelectedItem,
        newItem,
        options
      );
      resolve(
        this.cleanReceived.bind(this)({
          ...response,
          selectedItem: selectedItem,
          sentItem: item,
        })
      );
    });
  }

  updateArray(
    scheme: string,
    selectedItem?: Record<string, unknown>,
    item?: Event | Event[],
    regular?: boolean,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>(async (resolve, reject) => {
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
            this.findOneAndUpdate.bind(this)(
              scheme,
              selectedItemElement,
              newItemElement,
              options
            )
          );
        }
        const responses = await Promise.all(promisedResponses);
        // console.log('responses:', responses);

        resolve(
          this.cleanReceived.bind(this)({
            receivedItem: responses.map((response) => response.receivedItem),
            result: responses.map((response) => response.result),
            selectedItem: selectedItem,
            sentItem: item,
          })
        );
      } else {
        // console.log('newItem:', newItem);
        const fullOperation = {
          operation: Operation.update,
          type: Type.array,
          subType: SubType.byFilter,
        };
        const callback = (error, doc) => {
          // console.log('Scheme:', scheme);
          if (error) {
            reject(error);
          } else {
            resolve(
              this.cleanReceived.bind(this)({
                receivedItem: this.generateReceivedItem.bind(this)(
                  doc,
                  scheme,
                  fullOperation
                ),
                result: doc,
                selectedItem: selectedItem,
                sentItem: item,
              })
            );
          }
        };
        this.populateAll.bind(this)(
          scheme,
          'updateMany',
          [selectedItem, newItem, options],
          fullOperation,
          callback.bind(this)
        );
      }
    });
  }

  deleteArray(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const newSelectedItem = this.generateNewItem(selectedItem);
      const fullOperation = {
        operation: Operation.delete,
        type: Type.array,
        subType: SubType.byFilter,
      };
      const callback = (error) => {
        // console.log('Scheme:', scheme);
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived.bind(this)({
              selectedItem,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'deleteMany',
        [newSelectedItem, options],
        fullOperation,
        callback.bind(this)
      );
    });
  }

  deleteItem(
    scheme: string,
    selectedItem?: Event,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const newSelectedItem = this.generateNewItem(selectedItem);
      const fullOperation = {
        operation: Operation.delete,
        type: Type.item,
        subType: SubType.byFilter,
      };
      const callback = (error, doc) => {
        // console.log('Scheme:', scheme);
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedItem.bind(this)(
                doc,
                scheme,
                fullOperation
              ),
              result: doc,
              selectedItem: selectedItem,
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'findOneAndDelete',
        [newSelectedItem, options],
        fullOperation,
        callback.bind(this)
      );
    });
  }

  deleteItemById(
    scheme: string,
    id: unknown,
    options?: QueryOptions
  ): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const fullOperation = {
        operation: Operation.delete,
        type: Type.item,
        subType: SubType.byId,
      };
      const callback = (error, doc) => {
        // console.log('Scheme:', scheme);
        if (error) {
          reject(error);
        } else {
          resolve(
            this.cleanReceived.bind(this)({
              receivedItem: this.generateReceivedItem.bind(this)(
                doc,
                scheme,
                fullOperation
              ),
              result: doc,
              selectedItem: { id: id },
            })
          );
        }
      };
      this.populateAll.bind(this)(
        scheme,
        'findByIdAndDelete',
        [id, options],
        fullOperation,
        callback.bind(this)
      );
    });
  }

  async findOneAndUpdateResult(
    // eslint-disable-next-line no-unused-vars
    resolve: (_value?) => void,
    // eslint-disable-next-line no-unused-vars
    reject: (_reason?) => void,
    error: unknown,
    doc: Document,
    result: unknown,
    scheme?: string,
    fullOperation?: FullOperation
  ): Promise<void> {
    if (error) {
      reject(error);
    } else {
      const item = {
        receivedItem: this.generateReceivedItem.bind(this)(
          doc,
          scheme,
          fullOperation
        ),
        result: result ? { doc, result } : doc,
      };
      resolve(item);
    }
  }
  async findOneAndUpdate(
    scheme: string,
    selectedItem: Event,
    item: Event,
    options?: QueryOptions
  ): Promise<{ receivedItem: unknown; result: unknown }> {
    return new Promise<{ receivedItem: unknown; result: unknown }>(
      async (resolve, reject) => {
        delete item.id;
        delete item._id;
        const id = selectedItem?.id || selectedItem?._id;
        const fullOperation: FullOperation = {
          operation: Operation.update,
          type: Type.item,
        };

        if (id) {
          fullOperation.subType = SubType.byId;
          const callback = (error, doc, result) => {
            // console.log('selectedItem:', selectedItem);
            this.findOneAndUpdateResult.bind(this)(
              resolve,
              reject,
              error,
              doc as Document,
              result,
              scheme,
              fullOperation
            );
          };
          this.populateAll.bind(this)(
            scheme,
            'findByIdAndUpdate',
            [id, item, { new: true, ...options }],
            fullOperation,
            callback.bind(this)
          );
        } else {
          fullOperation.subType = SubType.byFilter;
          const callback = (error, doc, result) => {
            // console.log('selectedItem:', selectedItem);
            this.findOneAndUpdateResult.bind(this)(
              resolve,
              reject,
              error,
              doc as Document,
              result,
              scheme,
              fullOperation
            );
          };
          this.populateAll.bind(this)(
            scheme,
            'findOneAndUpdate',
            [selectedItem, item, options],
            fullOperation,
            callback.bind(this)
          );
        }
      }
    );
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
