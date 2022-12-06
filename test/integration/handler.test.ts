/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Handler } from '../../source/handler/handler';
import { PersistenceInfo } from '../../source/database/persistenceInfo';
import { Operation } from '../../source/event/operation';
import { Event } from '../../source/event/event';
import { MongoPersistence } from '../../source/database/noSQL/mongoDB/mongoPersistence';
import { Journaly, SenderReceiver } from 'journaly';
import ObjectSchema from './objectSchema';
import { IOutput } from '../../source/iPersistence/output/iOutput';
import { ObjectId } from 'mongoose';

let read;
let write;
let handler;

describe('Read and Write', () => {
  beforeEach(async () => {
    // console.log('beforeEach');
    // if (handler !== undefined) {
    //   await handler?.getRead()?.clear();
    //   await handler?.getWrite()?.clear();
    // }
    const journaly = Journaly.newJournaly() as SenderReceiver<any>;
    read = new MongoPersistence(
      new PersistenceInfo(
        {
          database: 'read',
          host: process.env.MONGO_HOST || 'localhost',
          port: process.env.MONGO_PORT,
        },
        journaly
      )
    );
    write = new MongoPersistence(
      new PersistenceInfo(
        {
          database: 'write',
          host: process.env.MONGO_HOST || 'localhost',
          port: process.env.MONGO_PORT,
        },
        journaly
      )
    );
    handler = new Handler(write, read);
    // await handler?.getRead()?.clear();
    // await handler?.getWrite()?.clear();
    // console.log('beforeEach done');
  });

  afterEach(async () => {
    // console.log('afterEach');
    if (handler !== undefined) {
      await handler?.getRead()?.clear();
      await handler?.getWrite()?.clear();
    }
    if (read !== undefined) await read?.close();
    if (write !== undefined) await write?.close();
    read = undefined;
    write = undefined;
    handler = undefined;
    // console.log('afterEach done');
  });

  test('add and read array and find object', async () => {
    // console.log('add and read array and find object');

    const obj = { test: 'test' };
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toMatchObject({
      ...obj,
    });

    expect(persistencePromise.sentItem).toMatchObject(obj);

    const persistencePromise1 = (await handler.readArray(
      'object',
      {}
    )) as IOutput<
      { id: ObjectId; test: string },
      { id: ObjectId; test: string },
      { id: ObjectId; test: string }
    >;

    expect(persistencePromise1.receivedItem).toMatchObject([obj]);

    expect(persistencePromise1.selectedItem).toStrictEqual({});

    const persistencePromise2 = (await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    )) as IOutput<
      { id: ObjectId; test: string },
      { id: ObjectId; test: string },
      { id: ObjectId; test: string }
    >;

    const expected = JSON.parse(
      JSON.stringify({
        receivedItem: {
          id: persistencePromise2?.receivedItem?.id,
          test: 'test',
        },
        result: {
          id: persistencePromise2?.receivedItem?.id,
          test: 'test',
        },
        // selectedItem: undefined,
        sentItem: undefined,
      })
    );

    expect(JSON.parse(JSON.stringify(persistencePromise2))).toMatchObject(
      expected
    );

    const persistencePromise3 = await handler.readArray('object', {});

    expect(persistencePromise3).toMatchObject({
      receivedItem: [],
      result: [],
      selectedItem: {},
    });
  });

  test('add an array and read array and find object', async () => {
    // console.log('add an array and read array and find object');
    const obj = { test: 'test' };
    const obj2 = { test: 'test2' };

    const objArray = [obj, obj2];
    const persistencePromise = await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: objArray,
      })
    );

    // console.log(persistencePromise);

    expect(persistencePromise.receivedItem).toMatchObject(objArray);

    expect(persistencePromise.sentItem).toMatchObject(objArray);

    const persistencePromise0 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        single: false,
        selection: {},
        content: { test: 'object' },
      })
    );

    expect(persistencePromise0).toMatchObject({
      receivedItem: {
        acknowledged: true,
        matchedCount: 2,
        modifiedCount: 2,
        upsertedCount: 0,
        upsertedId: null,
      },
      result: {
        acknowledged: true,
        matchedCount: 2,
        modifiedCount: 2,
        upsertedCount: 0,
        upsertedId: null,
      },
      selectedItem: {},
      sentItem: { test: 'object' },
    });

    const persistencePromise1 = await handler.readArray('object', {});

    const newObj = { ...obj, test: 'object' };
    const newObj2 = { ...obj2, test: 'object' };
    const newObjArray = [newObj, newObj2];

    // console.log(obj);

    expect(persistencePromise1.receivedItem).toMatchObject(newObjArray);

    expect(persistencePromise1.selectedItem).toStrictEqual({});

    const persistencePromise2 = await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );

    // console.log(persistencePromise2);

    expect(persistencePromise2).toStrictEqual({});

    const persistencePromise20 = await handler.readArray('object', {});
    // console.log(persistencePromise20);

    expect(persistencePromise20.receivedItem).toMatchObject([]);

    // console.log(obj);

    const persistencePromise3 = (await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: obj,
      })
    )) as IOutput<unknown, unknown, { id: ObjectId; test: string }>;

    expect(persistencePromise3.receivedItem).toMatchObject(obj);

    expect(persistencePromise3.sentItem).toMatchObject(obj);

    const persistencePromise30 = await handler.readArray('object', {});
    // console.log(persistencePromise30);

    expect(persistencePromise30.receivedItem).toMatchObject([obj]);

    expect(persistencePromise30.selectedItem).toStrictEqual({});

    const persistencePromise31 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        single: true,
        selection: {},
        content: { test: 'object' },
      })
    );

    // console.log(obj);

    expect(persistencePromise31.receivedItem).toMatchObject(obj);

    expect(persistencePromise31.selectedItem).toStrictEqual({});

    expect(persistencePromise31.sentItem).toMatchObject({ test: 'object' });

    const persistencePromise32 = await handler.readArray('object', {});
    // console.log(persistencePromise32);

    expect(persistencePromise32.receivedItem).toMatchObject([
      { ...obj, test: 'object' },
    ]);

    // console.log('match:', persistencePromise32.selectedItem);

    expect(persistencePromise32.selectedItem).toStrictEqual({});

    if (!JSON.parse(process.env.CI || 'false')) {
      const persistencePromise33 = await handler.migrate();
      expect(persistencePromise33).toStrictEqual(true);
    }

    const persistencePromise34 = await handler.readArray('object', {});

    expect(persistencePromise34.receivedItem).toMatchObject([
      { ...obj, test: 'object' },
    ]);

    expect(persistencePromise34.selectedItem).toStrictEqual({});

    const persistencePromise35 = (await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: obj2,
      })
    )) as IOutput<unknown, unknown, { id: ObjectId; test: string }>;

    expect(persistencePromise35.receivedItem).toMatchObject(obj2);

    expect(persistencePromise35.sentItem).toMatchObject(obj2);

    const persistencePromise36 = await handler.readArray('object', {});

    expect(persistencePromise36.receivedItem).toMatchObject([
      { ...obj, test: 'object' },
      obj2,
    ]);

    expect(persistencePromise36.selectedItem).toStrictEqual({});

    const updateObjects = [
      { ...obj, test: 'new object' },
      { ...obj2, test: 'new object2' },
    ];

    // console.log('Update Array:', updateObjects);

    const persistencePromise37 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        selection: {},
        single: false,
        content: updateObjects,
      })
    );

    // console.log('Updated Array:', persistencePromise37);

    expect(persistencePromise37.receivedItem).toMatchObject(updateObjects);

    expect(persistencePromise37.selectedItem).toStrictEqual({});

    expect(persistencePromise37.sentItem).toMatchObject(updateObjects);

    // console.log('DONE Update Array!');

    const persistencePromise38 = await handler.readArray('object', {});

    expect(persistencePromise38.receivedItem).toMatchObject(updateObjects);

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { id: persistencePromise3?.receivedItem?.id },
      })
    );
    // console.log('persistencePromise3:', persistencePromise3);
    // console.log('persistencePromise4:', persistencePromise4);

    expect(persistencePromise4.receivedItem).toMatchObject({
      ...obj,
      test: 'new object',
    });

    expect(persistencePromise4.selectedItem).toMatchObject({
      id: persistencePromise3?.receivedItem?.id.toString(),
    });

    const persistencePromise41 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { id: persistencePromise35?.receivedItem?.id },
      })
    );
    // console.log('persistencePromise41:', persistencePromise41);

    expect(persistencePromise41.receivedItem).toMatchObject({
      ...obj2,
      test: 'new object2',
    });

    const persistencePromise5 = await handler.readArray('object', {});

    expect(persistencePromise5.receivedItem).toMatchObject([]);

    expect(persistencePromise5.selectedItem).toStrictEqual({});
  });

  test('add and read object', async () => {
    // console.log('add and read object');
    const obj = { test: 'test' };

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toMatchObject(obj);

    expect(persistencePromise.sentItem).toMatchObject(obj);

    const persistencePromise1 = (await handler.readItemById(
      'object',
      obj['id']
    )) as IOutput<
      { id: ObjectId; test: string },
      { id: ObjectId; test: string },
      { id: ObjectId; test: string }
    >;

    expect(persistencePromise1.receivedItem).toMatchObject(obj);

    expect(persistencePromise1.selectedItem).toMatchObject({
      id: persistencePromise1?.receivedItem?.id,
    });

    const persistencePromise2 = await handler.readItem('object', {
      test: 'test',
    });

    expect(persistencePromise2.receivedItem).toMatchObject(obj);

    expect(persistencePromise2.selectedItem).toMatchObject({ test: 'test' });

    const persistencePromise3 = await handler.readItem('object', {
      id: obj['id'],
    });

    expect(persistencePromise3.receivedItem).toMatchObject(obj);

    expect(persistencePromise3.selectedItem).toMatchObject({
      id: persistencePromise1?.receivedItem?.id,
    });

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        // single: false,
      })
    );

    expect(persistencePromise4.receivedItem).toMatchObject(obj);

    const persistencePromise5 = await handler.addEvent(
      new Event({
        operation: Operation.read,
        name: 'object',
        single: false,
      })
    );

    expect(persistencePromise5.receivedItem).toMatchObject([]);
  });
});

describe('Just Write', () => {
  beforeEach(async () => {
    // console.log('beforeEach');
    // if (handler !== undefined) {
    //   await handler?.getRead()?.clear();
    //   await handler?.getWrite()?.clear();
    // }
    const journaly = Journaly.newJournaly() as SenderReceiver<any>;
    write = new MongoPersistence(
      new PersistenceInfo(
        {
          database: 'write',
          host: process.env.MONGO_HOST || 'localhost',
          port: process.env.MONGO_PORT,
        },
        journaly
      ),
      {
        object: new ObjectSchema(),
      }
    );
    // await handler?.getRead()?.clear();
    // await handler?.getWrite()?.clear();
    // console.log('beforeEach done');
  });

  afterEach(async () => {
    // console.log('afterEach');
    if (handler !== undefined) {
      await handler?.getRead()?.clear();
      await handler?.getWrite()?.clear();
    }
    if (write !== undefined) await write?.close();
    write = undefined;
    handler = undefined;
    // console.log('afterEach done');
  });

  test('WRITE add and read array and find object', async () => {
    // console.log('WRITE add and read array and find object');
    handler = new Handler(write);
    const obj = { test: 'test' };
    const persistencePromise = (await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }
    >;

    // console.log(obj);

    obj['id'] = obj['id'].toString();

    // console.log(persistencePromise.receivedItem);

    expect(persistencePromise.receivedItem).toMatchObject({
      id: persistencePromise?.receivedItem?.id,
      content: obj,
      single: true,
      name: 'object',
      replace: false,
      correct: false,
      operation: Operation.create,
      timestamp: persistencePromise?.receivedItem?.timestamp,
    });

    const persistencePromise1 = await handler.readArray('events', {});
    expect(persistencePromise1.receivedItem).toMatchObject([
      {
        id: persistencePromise?.receivedItem?.id,
        content: obj,
        single: true,
        name: 'object',
        replace: false,
        correct: false,
        operation: Operation.create,
        timestamp: persistencePromise?.receivedItem?.timestamp,
      },
    ]);
    expect(persistencePromise1.selectedItem).toStrictEqual({});
    expect(persistencePromise1.sentItem).toStrictEqual(undefined);

    const persistencePromise2 = (await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { test: 'test' },
      })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp: string }
    >;

    expect(persistencePromise2.receivedItem).toMatchObject({
      id: persistencePromise2?.receivedItem?.id,
      selection: {
        test: 'test',
      },
      single: true,
      name: 'object',
      correct: false,
      operation: Operation.delete,
      timestamp: persistencePromise2?.receivedItem?.timestamp,
    });
    expect(persistencePromise2.selectedItem).toStrictEqual(undefined);
    expect(persistencePromise2.sentItem).toMatchObject(
      new Event({
        id: persistencePromise2?.sentItem?.id,
        operation: Operation.delete,
        single: true,
        name: 'object',
        selection: { test: 'test' },
        timestamp: persistencePromise2?.sentItem?.timestamp,
      })
    );

    const persistencePromise3 = (await handler.readArray(
      'object',
      {}
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }[]
    >;

    // console.log(persistencePromise3?.receivedItem);

    expect(persistencePromise3?.receivedItem?.length).toBe(0);
    expect(persistencePromise3.receivedItem).toMatchObject([]);
    expect(persistencePromise3.selectedItem).toStrictEqual({});
    expect(persistencePromise3.sentItem).toStrictEqual(undefined);

    const persistencePromise4 = await handler.getWrite()?.clear();
    expect(persistencePromise4?.receivedItem).toStrictEqual(undefined);
  });

  test('Disable Read', async () => {
    // console.log('Disable Read');
    handler = new Handler(write, write, { drop: { read: true } });
    await handler.getWrite()?.clear();
    const obj = { test: 'test' };
    (await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }
    >;
    // console.log('create object', persistencePromise);

    const persistencePromise2 = (await handler.addEvent(
      new Event({ operation: Operation.read, name: 'object', single: false })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }[]
    >;
    // console.log('read object', persistencePromise2);

    const persistencePromise3 = (await handler.getWrite()?.read()) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }[]
    >;
    // console.log('read events', persistencePromise3?.receivedItem);

    expect(persistencePromise2?.receivedItem?.length).toBe(1);
    expect(persistencePromise3?.receivedItem?.length).toBe(1);
  });

  test('Enable Read', async () => {
    // console.log('Enable Read');
    handler = new Handler(write, write, { drop: { read: false } });
    await handler.getWrite()?.clear();
    const obj = { test: 'test' };

    (await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }
    >;

    // console.log('create object', persistencePromise);

    const persistencePromise2 = (await handler.addEvent(
      new Event({ operation: Operation.read, name: 'object', single: false })
    )) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }[]
    >;

    // console.log('read object', persistencePromise2);

    const persistencePromise3 = (await handler.getWrite()?.read()) as IOutput<
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string },
      { id: ObjectId; test: string; timestamp?: string }[]
    >;
    // console.log('read events', persistencePromise3?.receivedItem);
    // while (true) { }

    expect(persistencePromise2?.receivedItem?.length).toBe(1);
    expect(persistencePromise3?.receivedItem?.length).toBe(2);
  });
});
