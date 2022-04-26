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
let handler;

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
    ),
    { object: new ObjectSchema() }
  );
  handler = new Handler(undefined, read);
  // await handler?.getRead()?.clear();
  // await handler?.getWrite()?.clear();
});

afterEach(async () => {
  // console.log('afterEach');
  if (handler !== undefined) {
    await handler?.getRead()?.clear();
    await handler?.getWrite()?.clear();
  }
  if (read !== undefined) await read?.close();
  read = undefined;
  handler = undefined;
});

afterAll(async () => {
  // console.log('afterAll');
  if (handler !== undefined) {
    await handler?.getRead()?.clear();
    await handler?.getWrite()?.clear();
  }
  if (read !== undefined) await read?.close();
});

test('add and read array and find object', async () => {
  const obj = { test: 'test' };

  const persistencePromise = await handler.addEvent(
    new Event({ operation: Operation.create, name: 'object', content: obj })
  );

  // console.log(persistencePromise.receivedItem);
  // console.log(obj);

  expect(persistencePromise.receivedItem).toMatchObject(obj);

  expect(persistencePromise.sentItem).toMatchObject(obj);

  const persistencePromise1 = (await handler.readArray(
    'object',
    {}
  )) as IOutput<{ id: ObjectId; test: string }, { id: ObjectId; test: string }>;

  expect(persistencePromise1.receivedItem).toMatchObject([obj]);

  expect(persistencePromise1.selectedItem).toStrictEqual({});

  const persistencePromise2 = (await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object' })
  )) as IOutput<{ id: ObjectId; test: string }, { id: ObjectId; test: string }>;

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
