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
test('add and read array and find object', async (done) => {
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
  const handler = new Handler(undefined, read);
  await handler.getRead()?.clear();
  const obj = { test: 'test' };
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual({
      ...obj,
    });

    expect(persistencePromise.sentItem).toStrictEqual(obj);

    const persistencePromise1 = (await handler.readArray(
      'object',
      {}
    )) as IOutput<
      { id: ObjectId; test: string },
      { id: ObjectId; test: string }
    >;

    expect(persistencePromise1.receivedItem).toStrictEqual([obj]);

    expect(persistencePromise1.selectedItem).toStrictEqual({});

    const persistencePromise2 = (await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    )) as IOutput<
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

    expect(JSON.parse(JSON.stringify(persistencePromise2))).toStrictEqual(
      expected
    );

    const persistencePromise3 = await handler.readArray('object', {});

    expect(persistencePromise3).toStrictEqual({
      receivedItem: [],
      result: [],
      selectedItem: {},
    });
  } catch (error) {
    await handler.getRead()?.clear();
    console.error(error);
    await read.close();
    expect(error).toBe(null);
    done();
  }
  await handler.getRead()?.clear();
  await read.close();
  done();
});
