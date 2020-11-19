// file deepcode ignore no-any: any needed
import { Handler } from '../../source/handler/handler';
import { PersistenceInfo } from '../../source/database/persistenceInfo';
import { Operation } from '../../source/event/operation';
import { Event } from '../../source/event/event';
import { MongoDB } from '../../source/database/noSQL/mongoDB/mongoDB';
import { PersistencePromise } from '../../source/persistenceAdapter/output/persistencePromise';
import { Journaly, SubjectObserver } from 'journaly';

let read;
let write;
test('add and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SubjectObserver<any>;
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
  await handler.getWrite().clear('events');
  const obj = {};
  obj['test'] = 'test';
  try {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );
    expect(persistencePromise).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise.receivedItem.__v,
          _id: persistencePromise.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: undefined,
        sentItem: {
          test: 'test',
        },
      })
    );

    const persistencePromise1 = await handler.readArray('object', {});

    expect(persistencePromise1).toStrictEqual(
      new PersistencePromise({
        receivedItem: [
          {
            __v: persistencePromise1.receivedItem[0].__v,
            _id: persistencePromise1.receivedItem[0]._id,
            test: 'test',
          },
        ],
        result: undefined,
        selectedItem: {},
        sentItem: undefined,
      })
    );

    const persistencePromise2 = await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const expected = JSON.parse(
      JSON.stringify(
        new PersistencePromise({
          receivedItem: {
            __v: 0,
            _id: persistencePromise2.receivedItem._id,
            test: 'test',
          },
          result: undefined,
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
        result: undefined,
        selectedItem: {},
        sentItem: undefined,
      })
    );
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear('events');
    console.error(error);
    await read.close();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object', single: false })
  );
  await handler.getWrite().clear('events');
  await read.close();
  await write.close();
  done();
});

test('add an array and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SubjectObserver<any>;
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
  await handler.getWrite().clear('events');
  const obj = {};
  obj['test'] = 'test';
  const obj2 = {};
  obj2['test'] = 'test2';

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

    expect(persistencePromise).toStrictEqual(
      new PersistencePromise({
        receivedItem: [
          {
            __v: persistencePromise.receivedItem[0].__v,
            _id: persistencePromise.receivedItem[0]._id,
            test: 'test',
          },
          {
            __v: persistencePromise.receivedItem[1].__v,
            _id: persistencePromise.receivedItem[1]._id,
            test: 'test2',
          },
        ],
        result: [undefined, undefined],
        selectedItem: undefined,
        sentItem: objArray,
      })
    );

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
        result: undefined,
        selectedItem: {},
        sentItem: { test: 'object' },
      })
    );

    const persistencePromise1 = await handler.readArray('object', {});

    expect(persistencePromise1).toStrictEqual(
      new PersistencePromise({
        receivedItem: [
          {
            __v: persistencePromise1.receivedItem[0].__v,
            _id: persistencePromise1.receivedItem[0]._id,
            test: 'object',
          },
          {
            __v: persistencePromise1.receivedItem[1].__v,
            _id: persistencePromise1.receivedItem[1]._id,
            test: 'object',
          },
        ],
        result: undefined,
        selectedItem: {},
        sentItem: undefined,
      })
    );

    const persistencePromise2 = await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );

    // console.log(persistencePromise2);

    expect(persistencePromise2).toStrictEqual(
      new PersistencePromise({
        receivedItem: undefined,
        result: undefined,
        selectedItem: undefined,
        sentItem: undefined,
      })
    );

    const persistencePromise3 = await handler.addEvent(
      new Event({
        operation: Operation.create,
        name: 'object',
        content: obj,
      })
    );

    expect(persistencePromise3).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise3.receivedItem.__v,
          _id: persistencePromise3.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: undefined,
        sentItem: obj,
      })
    );

    const persistencePromise31 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        single: true,
        selection: {},
        content: { test: 'object' },
      })
    );

    expect(persistencePromise31).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise3.receivedItem.__v,
          _id: persistencePromise3.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: {},
        sentItem: { test: 'object' },
      })
    );

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { id: persistencePromise3.receivedItem._id },
      })
    );
    // console.log('persistencePromise3:', persistencePromise3);
    // console.log('persistencePromise4:', persistencePromise4);

    expect(JSON.stringify(persistencePromise4)).toStrictEqual(
      JSON.stringify(
        new PersistencePromise({
          receivedItem: {
            _id: persistencePromise3.receivedItem._id,
            test: 'object',
            __v: persistencePromise3.receivedItem.__v,
          },
          result: undefined,
          selectedItem: persistencePromise3.receivedItem._id,
          sentItem: undefined,
        })
      )
    );

    const persistencePromise5 = await handler.readArray('object', {});

    expect(persistencePromise5).toStrictEqual(
      new PersistencePromise({
        receivedItem: [],
        result: undefined,
        selectedItem: {},
        sentItem: undefined,
      })
    );
  } catch (error) {
    console.error(error);
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear('events');
    await read.close();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object', single: false })
  );
  await handler.getWrite().clear('events');
  await read.close();
  await write.close();
  done();
});

test('add and read object', async (done) => {
  const journaly = Journaly.newJournaly() as SubjectObserver<any>;
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
  await handler.getWrite().clear('events');
  const obj = {};
  obj['test'] = 'test';
  try {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise.receivedItem.__v,
          _id: persistencePromise.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: undefined,
        sentItem: {
          test: 'test',
        },
      })
    );

    const persistencePromise1 = await handler.readItemById(
      'object',
      persistencePromise.receivedItem._id
    );

    expect(persistencePromise1).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise1.receivedItem.__v,
          _id: persistencePromise1.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: { _id: persistencePromise1.receivedItem._id },
        sentItem: undefined,
      })
    );

    const persistencePromise2 = await handler.readItem('object', {
      test: 'test',
    });

    expect(persistencePromise2).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise1.receivedItem.__v,
          _id: persistencePromise1.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: { test: 'test' },
        sentItem: undefined,
      })
    );

    const persistencePromise3 = await handler.readItem('object', {
      _id: persistencePromise1.receivedItem._id,
    });

    expect(persistencePromise3).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise1.receivedItem.__v,
          _id: persistencePromise1.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: { _id: persistencePromise1.receivedItem._id },
        sentItem: undefined,
      })
    );

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        // single: false,
      })
    );

    expect(persistencePromise4).toStrictEqual(
      new PersistencePromise({
        receivedItem: {
          __v: persistencePromise1.receivedItem.__v,
          _id: persistencePromise1.receivedItem._id,
          test: 'test',
        },
        result: undefined,
        selectedItem: undefined,
        sentItem: undefined,
      })
    );

    const persistencePromise5 = await handler.addEvent(
      new Event({
        operation: Operation.read,
        name: 'object',
        single: false,
      })
    );

    expect(persistencePromise5).toStrictEqual(
      new PersistencePromise({
        receivedItem: [],
        result: undefined,
        selectedItem: undefined,
        sentItem: undefined,
      })
    );
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear('events');
    await read.close();
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await read.close();
  await write.close();
  done();
});

test('WRITE add and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SubjectObserver<any>;
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
  await handler.getWrite().clear('events');
  const obj = {};
  obj['test'] = 'test';
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.create, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual({
      _id: persistencePromise.receivedItem._id,
      __v: persistencePromise.receivedItem.__v,
      content: {
        test: 'test',
      },
      single: true,
      name: 'object',
      operation: Operation.create,
      timestamp: persistencePromise.receivedItem.timestamp,
    });

    const persistencePromise1 = await handler.readArray('events', {});
    expect(persistencePromise1.receivedItem).toStrictEqual([
      {
        _id: persistencePromise.receivedItem._id,
        __v: persistencePromise.receivedItem.__v,
        content: {
          test: 'test',
        },
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
      _id: persistencePromise2.receivedItem._id,
      __v: persistencePromise2.receivedItem.__v,
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
        __v: persistencePromise2.sentItem.__v,
        _id: persistencePromise2.sentItem._id,
        operation: Operation.delete,
        single: true,
        name: 'object',
        selection: { test: 'test' },
        timestamp: persistencePromise2.sentItem.timestamp,
      })
    );

    const persistencePromise3 = await handler.readArray('object', {});

    expect(persistencePromise3.receivedItem.length).toBe(0);
    expect(persistencePromise3.result).toBe(undefined);
    expect(persistencePromise3.receivedItem).toStrictEqual([]);
    expect(persistencePromise3.selectedItem).toStrictEqual({});
    expect(persistencePromise3.sentItem).toStrictEqual(undefined);

    const persistencePromise4 = await handler.getWrite().clear('events');
    expect(persistencePromise4).toStrictEqual(
      new PersistencePromise({
        receivedItem: undefined,
        result: undefined,
        selectedItem: undefined,
        sentItem: undefined,
      })
    );
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.delete, name: 'object', single: false })
    );
    await handler.getWrite().clear('events');
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.delete, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await write.close();
  done();
});
