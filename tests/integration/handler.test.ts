import { Handler } from '../../source/handler/handler';
import { DatabaseInfo } from '../../source/database/databaseInfo';
import { Operation } from '../../source/event/operation';
import { Event } from '../../source/event/event';
import { MongoDB } from '../../source/database/noSQL/mongoDB/mongoDB';
import { PostgresDB } from '../../source/database/sQL/postgresDB/postgresDB';
// import { SelectedItemValue } from '../../model/selectedItemValue';
// import { RelationValuePostgresDB } from '../../database/sQL/postgresDB/relationValuePostgresDB';
import Utils from '../../source/utils';
import { PersistencePromise } from '../../source/persistenceAdapter/persistencePromise';

let read;
let write;
test('add and read array and find object', async done => {
  read = new MongoDB(
    new DatabaseInfo({
      database: 'read',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  write = new MongoDB(
    new DatabaseInfo({
      database: 'write',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear('events');
  const obj = new Object();
  obj['test'] = 'test';
  try {
    await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.add, name: 'object', content: obj })
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
      new Event({ operation: Operation.clear, name: 'object' })
    );

    expect(persistencePromise2).toStrictEqual(
      new PersistencePromise({
        receivedItem: undefined,
        result: undefined,
        selectedItem: undefined,
        sentItem: undefined,
      })
    );
  } catch (error) {
    console.error(error);
    await read.close();
    await write.close();
    expect(error).toBe(null);
    done();
  }
  await read.close();
  await write.close();
  done();
});

test('add and read object', async done => {
  read = new MongoDB(
    new DatabaseInfo({
      database: 'read',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  write = new MongoDB(
    new DatabaseInfo({
      database: 'write',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear('events');
  const obj = new Object();
  obj['test'] = 'test';
  try {
    await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );

    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.add, name: 'object', content: obj })
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
      new Event({ operation: Operation.clear, name: 'object' })
    );
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
      new Event({ operation: Operation.clear, name: 'object' })
    );
    await handler.getWrite().clear('events');
    await read.close();
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.clear, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await read.close();
  await write.close();
  done();
});

test('add and read array and find object', async done => {
  const info = new DatabaseInfo({
    database: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'evox2019',
  });

  read = new PostgresDB(info);
  write = new MongoDB(
    new DatabaseInfo({
      database: 'write',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear('events');
  await Utils.init(read.getPool());
  const obj = new Object();
  obj['test'] = 'test';
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.add, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual({
      _id: persistencePromise.receivedItem._id,
      test: 'test',
      testnumber: null,
    });

    const persistencePromise1 = await handler.readArray('object', {});
    expect(persistencePromise1.receivedItem).toStrictEqual([
      {
        _id: persistencePromise1.receivedItem[0]._id,
        test: 'test',
        testnumber: null,
      },
    ]);
    expect(persistencePromise1.selectedItem).toStrictEqual({});
    expect(persistencePromise1.sentItem).toStrictEqual(undefined);

    const persistencePromise2 = await handler.readItem('object', {});

    expect(persistencePromise2.receivedItem).toStrictEqual({
      _id: persistencePromise2.receivedItem._id,
      test: 'test',
      testnumber: null,
    });
    expect(persistencePromise2.selectedItem).toStrictEqual({});
    expect(persistencePromise2.sentItem).toStrictEqual(undefined);

    const persistencePromise3 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        selection: { test: 'test' },
        content: { test: 'bob' },
      })
    );
    // console.log(persistencePromise3);
    expect(persistencePromise3.result.rowCount).toBe(1);
    expect(persistencePromise3.receivedItem).toStrictEqual({
      _id: persistencePromise2.receivedItem._id,
      test: 'bob',
      testnumber: null,
    });
    expect(persistencePromise3.selectedItem).toStrictEqual({
      test: 'test',
    });
    expect(persistencePromise3.sentItem).toStrictEqual({
      test: 'bob',
    });
    // console.log(await read.query('UPDATE object SET test = \'bob\', testNumber = \'10\' WHERE (test = \'test\')', [], {}));

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { test: 'bob' },
      })
    );

    expect(persistencePromise4.receivedItem).toStrictEqual(undefined);
    expect(persistencePromise4.selectedItem).toStrictEqual({ test: 'bob' });
    expect(persistencePromise4.sentItem).toStrictEqual(undefined);

    const persistencePromise5 = await handler.readArray('object', {});

    expect(persistencePromise5.receivedItem.length).toBe(0);
    expect(persistencePromise5.result.rowCount).toBe(0);
    expect(persistencePromise5.receivedItem).toStrictEqual([]);
    expect(persistencePromise5.selectedItem).toStrictEqual({});
    expect(persistencePromise5.sentItem).toStrictEqual(undefined);

    const persistencePromise6 = await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );
    expect(persistencePromise6.receivedItem).toStrictEqual([]);
    expect(persistencePromise6.selectedItem).toStrictEqual(undefined);
    expect(persistencePromise6.sentItem).toStrictEqual(undefined);
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );
    const persistencePromise7 = await handler.readArray('object', {});
    expect(persistencePromise7.result.rowCount).toBe(0);
    await handler.getWrite().clear('events');
    await Utils.dropTables(read.getPool());
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.clear, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await Utils.dropTables(read.getPool());
  await write.close();
  done();
});

test('add complex object and read array and find object', async done => {
  const info = new DatabaseInfo({
    database: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'evox2019',
  });

  read = new PostgresDB(info);
  write = new MongoDB(
    new DatabaseInfo({
      database: 'write',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  const handler = new Handler(write, read);
  await handler.getWrite().clear('events');
  await Utils.init(read.getPool());
  const obj = { test: 'test', test2: { test: 'test' } };
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.add, name: 'object2', content: obj })
    );

    console.log(persistencePromise.receivedItem.test2);

    expect(persistencePromise.receivedItem).toStrictEqual({
      _id: persistencePromise.receivedItem._id,
      test: 'test',
      test2: { test: 'test' },
      testnumber: null,
    });

    const persistencePromise1 = await handler.readArray('object', {});
    expect(persistencePromise1.receivedItem).toStrictEqual([
      {
        _id: persistencePromise1.receivedItem[0]._id,
        test: 'test',
        testnumber: null,
      },
    ]);
    expect(persistencePromise1.selectedItem).toStrictEqual({});
    expect(persistencePromise1.sentItem).toStrictEqual(undefined);

    const persistencePromise2 = await handler.readItem('object', {});

    expect(persistencePromise2.receivedItem).toStrictEqual({
      _id: persistencePromise2.receivedItem._id,
      test: 'test',
      testnumber: null,
    });
    expect(persistencePromise2.selectedItem).toStrictEqual({});
    expect(persistencePromise2.sentItem).toStrictEqual(undefined);

    const persistencePromise3 = await handler.addEvent(
      new Event({
        operation: Operation.update,
        name: 'object',
        selection: { test: 'test' },
        content: { test: 'bob' },
      })
    );
    // console.log(persistencePromise3);
    expect(persistencePromise3.result.rowCount).toBe(1);
    expect(persistencePromise3.receivedItem).toStrictEqual({
      _id: persistencePromise2.receivedItem._id,
      test: 'bob',
      testnumber: null,
    });
    expect(persistencePromise3.selectedItem).toStrictEqual({
      test: 'test',
    });
    expect(persistencePromise3.sentItem).toStrictEqual({
      test: 'bob',
    });
    // console.log(await read.query('UPDATE object SET test = \'bob\', testNumber = \'10\' WHERE (test = \'test\')', [], {}));

    const persistencePromise4 = await handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: 'object',
        selection: { test: 'bob' },
      })
    );

    expect(persistencePromise4.receivedItem).toStrictEqual(undefined);
    expect(persistencePromise4.selectedItem).toStrictEqual({ test: 'bob' });
    expect(persistencePromise4.sentItem).toStrictEqual(undefined);

    const persistencePromise5 = await handler.readArray('object', {});

    expect(persistencePromise5.receivedItem.length).toBe(0);
    expect(persistencePromise5.result.rowCount).toBe(0);
    expect(persistencePromise5.receivedItem).toStrictEqual([]);
    expect(persistencePromise5.selectedItem).toStrictEqual({});
    expect(persistencePromise5.sentItem).toStrictEqual(undefined);

    const persistencePromise6 = await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );
    expect(persistencePromise6.receivedItem).toStrictEqual([]);
    expect(persistencePromise6.selectedItem).toStrictEqual(undefined);
    expect(persistencePromise6.sentItem).toStrictEqual(undefined);
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );
    const persistencePromise7 = await handler.readArray('object', {});
    expect(persistencePromise7.result.rowCount).toBe(0);
    await handler.getWrite().clear('events');
    await Utils.dropTables(read.getPool());
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.clear, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await Utils.dropTables(read.getPool());
  await write.close();
  done();
});

test('WRITE add and read array and find object', async done => {
  write = new MongoDB(
    new DatabaseInfo({
      database: 'write',
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT,
    })
  );
  const handler = new Handler(write);
  await handler.getWrite().clear('events');
  await Utils.init(read.getPool());
  const obj = new Object();
  obj['test'] = 'test';
  try {
    const persistencePromise = await handler.addEvent(
      new Event({ operation: Operation.add, name: 'object', content: obj })
    );

    expect(persistencePromise.receivedItem).toStrictEqual({
      _id: persistencePromise.receivedItem._id,
      __v: persistencePromise.receivedItem.__v,
      content: {
        test: 'test',
      },
      name: 'object',
      operation: 0,
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
        name: 'object',
        operation: 0,
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
      name: 'object',
      operation: 5,
      timestamp: persistencePromise2.receivedItem.timestamp,
    });
    expect(persistencePromise2.selectedItem).toStrictEqual(undefined);
    expect(persistencePromise2.sentItem).toStrictEqual(
      new Event({
        __v: persistencePromise2.sentItem.__v,
        _id: persistencePromise2.sentItem._id,
        operation: Operation.delete,
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
        selectedItem: {},
        sentItem: undefined,
      })
    );
  } catch (error) {
    await handler.addEvent(
      new Event({ operation: Operation.clear, name: 'object' })
    );
    await handler.getWrite().clear('events');
    await Utils.end(read.getPool());
    await write.close();
    console.error(error);
    expect(error).toBe(null);
    done();
  }
  await handler.addEvent(
    new Event({ operation: Operation.clear, name: 'object' })
  );
  await handler.getWrite().clear('events');
  await Utils.end(read.getPool());
  await write.close();
  done();
});
