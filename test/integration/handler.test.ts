/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Handler } from '../../source/handler/handler';
import { PersistenceInfo } from '../../source/database/persistenceInfo';
import { Operation } from '../../source/event/operation';
import { Event } from '../../source/event/event';
import { MongoDB } from '../../source/database/noSQL/mongoDB/mongoDB';
import { PersistencePromise } from '../../source/persistenceAdapter/output/persistencePromise';
import { Journaly, SenderReceiver } from 'journaly';
import ObjectSchema from './objectSchema';

let read;
let write;
test('add and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SenderReceiver<any>;
  read = new MongoDB(
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
  write = new MongoDB(
    new PersistenceInfo(
      {
        database: 'write',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear();
  const obj = { test: 'test' };
  try {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual({
      ...obj,
    });

    expect(persistencePromise.sentItem).toStrictEqual(obj);

    const persistencePromise1 = await handler.readArray('object', {});

    expect(persistencePromise1.receivedItem).toStrictEqual([obj]);

    expect(persistencePromise1.selectedItem).toStrictEqual({});

    const persistencePromise2 = await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const expected = JSON.parse(
      JSON.stringify(
        new PersistencePromise({
          receivedItem: {
            id: persistencePromise2.receivedItem.id,
            test: 'test',
          },
          result: {
            id: persistencePromise2.receivedItem.id,
            test: 'test',
          },
          // selectedItem: undefined,
          sentItem: undefined,
        })
      )
    );

    expect(JSON.parse(JSON.stringify(persistencePromise2))).toStrictEqual(
      expected
    );

    const persistencePromise3 = await handler.readArray('object', {});

    expect(persistencePromise3).toStrictEqual(
      new PersistencePromise({
        receivedItem: [],
        result: [],
        selectedItem: {},
        sentItem: undefined,
      })
    );
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear();
    console.error(error);
    await read.close();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object', single: false })
  );
  await handler.getWrite().clear();
  await read.close();
  await write.close();
  done();
});

test('add an array and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SenderReceiver<any>;
  read = new MongoDB(
    new PersistenceInfo(
      {
        database: 'read',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  write = new MongoDB(
    new PersistenceInfo(
      {
        database: 'write',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear();
  const obj = { test: 'test' };
  const obj2 = { test: 'test2' };

  const objArray = [obj, obj2];
  try {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: objArray,
      })
    );

    // console.log(persistencePromise);

    expect(persistencePromise.receivedItem).toStrictEqual(objArray);

    expect(persistencePromise.sentItem).toStrictEqual(objArray);

    const persistencePromise0 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        single: false,
        selection: {},
        content: { test: 'object' },
      })
    );

    expect(persistencePromise0).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          n: 2,
          nModified: 2,
          ok: 1,
        },
        result: {
          n: 2,
          nModified: 2,
          ok: 1,
        },
        selectedItem: {},
        sentItem: { test: 'object' },
      })
    );

    const persistencePromise1 = await handler.readArray('object', {});

    const newObj = { ...obj, test: 'object' };
    const newObj2 = { ...obj2, test: 'object' };
    const newObjArray = [newObj, newObj2];

    // console.log(obj);

    expect(persistencePromise1.receivedItem).toStrictEqual(newObjArray);

    expect(persistencePromise1.selectedItem).toStrictEqual({});

    const persistencePromise2 = await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );

    // console.log(persistencePromise2);

    expect(persistencePromise2).toStrictEqual(new PersistencePromise({}));

    const persistencePromise20 = await handler.readArray('object', {});
    // console.log(persistencePromise20);

    expect(persistencePromise20.receivedItem).toStrictEqual([]);

    // console.log(obj);

    const persistencePromise3 = await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: obj,
      })
    );

    expect(persistencePromise3.receivedItem).toStrictEqual(obj);

    expect(persistencePromise3.sentItem).toStrictEqual(obj);

    const persistencePromise30 = await handler.readArray('object', {});
    // console.log(persistencePromise30);

    expect(persistencePromise30.receivedItem).toStrictEqual([obj]);

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

    expect(persistencePromise31.receivedItem).toStrictEqual(obj);

    expect(persistencePromise31.selectedItem).toStrictEqual({});

    expect(persistencePromise31.sentItem).toStrictEqual({ test: 'object' });

    const persistencePromise32 = await handler.readArray('object', {});
    // console.log(persistencePromise32);

    expect(persistencePromise32.receivedItem).toStrictEqual([
      { ...obj, test: 'object' },
    ]);

    expect(persistencePromise32.selectedItem).toStrictEqual({});

    const persistencePromise33 = await handler.migrate();
    expect(persistencePromise33).toStrictEqual(true);

    const persistencePromise34 = await handler.readArray('object', {});

    expect(persistencePromise34.receivedItem).toStrictEqual([
      { ...obj, test: 'object' },
    ]);

    expect(persistencePromise34.selectedItem).toStrictEqual({});

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { id: persistencePromise3.receivedItem.id },
      })
    );
    // console.log('persistencePromise3:', persistencePromise3);
    // console.log('persistencePromise4:', persistencePromise4);

    expect(persistencePromise4.receivedItem).toStrictEqual({
      ...obj,
      test: 'object',
    });

    expect(persistencePromise4.selectedItem).toStrictEqual({
      id: persistencePromise3.receivedItem.id.toString(),
    });

    const persistencePromise5 = await handler.readArray('object', {});

    expect(persistencePromise5.receivedItem).toStrictEqual([]);

    expect(persistencePromise5.selectedItem).toStrictEqual({});
  } catch (error) {
    console.error(error);
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear();
    await read.close();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object', single: false })
  );
  await handler.getWrite().clear();
  await read.close();
  await write.close();
  done();
});

test('add and read object', async (done) => {
  const journaly = Journaly.newJournaly() as SenderReceiver<any>;
  read = new MongoDB(
    new PersistenceInfo(
      {
        database: 'read',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  write = new MongoDB(
    new PersistenceInfo(
      {
        database: 'write',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear();
  const obj = { test: 'test' };
  try {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual(obj);

    expect(persistencePromise.sentItem).toStrictEqual(obj);

    const persistencePromise1 = await handler.readItemById('object', obj['id']);

    expect(persistencePromise1.receivedItem).toStrictEqual(obj);

    expect(persistencePromise1.selectedItem).toStrictEqual({
      id: persistencePromise1.receivedItem.id,
    });

    const persistencePromise2 = await handler.readItem('object', {
      test: 'test',
    });

    expect(persistencePromise2.receivedItem).toStrictEqual(obj);

    expect(persistencePromise2.selectedItem).toStrictEqual({ test: 'test' });

    const persistencePromise3 = await handler.readItem('object', {
      id: obj['id'],
    });

    expect(persistencePromise3.receivedItem).toStrictEqual(obj);

    expect(persistencePromise3.selectedItem).toStrictEqual({
      id: persistencePromise1.receivedItem.id,
    });

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        // single: false,
      })
    );

    expect(persistencePromise4.receivedItem).toStrictEqual(obj);

    const persistencePromise5 = await handler.addEvent(
      new Event({
        operation: Operation.read,
        name: 'object',
        single: false,
      })
    );

    expect(persistencePromise5.receivedItem).toStrictEqual([]);
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear();
    await read.close();
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object' })
  );
  await handler.getWrite().clear();
  await read.close();
  await write.close();
  done();
});

test('WRITE add and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SenderReceiver<any>;
  write = new MongoDB(
    new PersistenceInfo(
      {
        database: 'write',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT,
      },
      journaly
    )
  );
  const handler = new Handler(write);
  await handler.getWrite().clear();
  const obj = { test: 'test' };
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    // console.log(obj);

    obj['id'] = obj['id'].toString();

    // console.log(persistencePromise.receivedItem);

    expect(persistencePromise.receivedItem).toStrictEqual({
      id: persistencePromise.receivedItem.id,
      content: obj,
      single: true,
      name: 'object',
      operation: Operation.create,
      timestamp: persistencePromise.receivedItem.timestamp,
    });

    const persistencePromise1 = await handler.readArray('events', {});
    expect(persistencePromise1.receivedItem).toStrictEqual([
      {
        id: persistencePromise.receivedItem.id,
        content: obj,
        single: true,
        name: 'object',
        operation: Operation.create,
        timestamp: persistencePromise.receivedItem.timestamp,
      },
    ]);
    expect(persistencePromise1.selectedItem).toStrictEqual({});
    expect(persistencePromise1.sentItem).toStrictEqual(undefined);

    const persistencePromise2 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { test: 'test' },
      })
    );

    expect(persistencePromise2.receivedItem).toStrictEqual({
      id: persistencePromise2.receivedItem.id,
      selection: {
        test: 'test',
      },
      single: true,
      name: 'object',
      operation: Operation.delete,
      timestamp: persistencePromise2.receivedItem.timestamp,
    });
    expect(persistencePromise2.selectedItem).toStrictEqual(undefined);
    expect(persistencePromise2.sentItem).toStrictEqual(
      new Event({
        id: persistencePromise2.sentItem.id,
        operation: Operation.delete,
        single: true,
        name: 'object',
        selection: { test: 'test' },
        timestamp: persistencePromise2.sentItem.timestamp,
      })
    );

    const persistencePromise3 = await handler.readArray('object', {});

    expect(persistencePromise3.receivedItem.length).toBe(0);
    expect(persistencePromise3.receivedItem).toStrictEqual([]);
    expect(persistencePromise3.selectedItem).toStrictEqual({});
    expect(persistencePromise3.sentItem).toStrictEqual(undefined);

    const persistencePromise4 = await handler.getWrite().clear();
    expect(persistencePromise4.receivedItem).toStrictEqual(undefined);
  } catch (error) {
    console.error(error);
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object' })
  );
  await handler.getWrite().clear();
  await write.close();
  done();
});
