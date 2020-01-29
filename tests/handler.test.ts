import { Handler } from '../handler/handler';
import { DatabaseInfo } from '../database/databaseInfo';
import { Operation } from '../event/operation';
import { Event } from '../event/event';
import { MongoDB } from '../database/noSQL/mongoDB/mongoDB';
import { PostgresDB } from '../database/sQL/postgresDB/postgresDB';
import { SelectedItemValue } from '../model/selectedItemValue'
import { RelationValuePostgresDB } from '../database/sQL/postgresDB/relationValuePostgresDB';
import * as fs from 'fs';

test('add and read array and find object', async (done) => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    try {
        let persistencePromise = await handler.addEvent(
            new Event({ operation: Operation.add, name: 'object', content: obj })
        );
        let persistencePromise1 = await handler.readArray('object', {});

        let ok = false;
        for (let index = 0; index < persistencePromise1.receivedItem.length; index++) {
            const element = persistencePromise1.receivedItem[index];
            if (element['test'] === obj['test']) {
                ok = true;
            }
        }

        await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' }));
        expect(ok).toBe(true);
    } catch (error) {
        await read.close();
        await write.close();
        expect(error).toBe(null);
        done();
    }
    await read.close();
    await write.close();
    done();
});

test('add and read object', async (done) => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(read, write);
    let obj = new Object;
    obj['test'] = 'test';
    try {
        let persistencePromise = await handler.addEvent(
            new Event({ operation: Operation.add, name: 'object', content: obj })
        );
        let persistencePromise1 = await handler.readItemById('object', persistencePromise.receivedItem._id);
        let ok = (persistencePromise1.receivedItem['test'] === obj['test']);
        let persistencePromise2 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' }));
        if (persistencePromise2) {
            expect(ok).toBe(true);
        }
    } catch (error) {
        await read.close();
        await write.close();
        expect(error).toBe(null);
        done();
    }
    await read.close();
    await write.close();
    done();
});

test('add and read array and find object', async (done) => {
    let read = new PostgresDB(new DatabaseInfo('postgres', process.env.POSTGRES_HOST || 'localhost',
        (+process.env.POSTGRES_PORT) || 5432, process.env.POSTGRES_USER));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    try {
        let script = await fs.promises.readFile('./tests/test.sql', 'utf8');
        await read.getPool().query(script);


        let persistencePromise = await handler.addEvent(
            new Event({ operation: Operation.add, name: 'object', content: obj })
        );
        let persistencePromise1 = await handler.readArray('object', {});


        let ok = false;
        for (let index = 0; index < persistencePromise1.receivedItem.length; index++) {
            const element = persistencePromise1.receivedItem[index];
            if (element['test'] === obj['test']) {
                ok = true;
            }
        }

        expect(ok).toBe(true);

        let persistencePromise2 = await handler.readItem('object', {});
        expect(persistencePromise2.receivedItem[0]['test']).toBe('test');
        let selectedItemValue = new SelectedItemValue(obj['test'], new RelationValuePostgresDB());
        let persistencePromise3 = await handler.addEvent(new Event({
            operation: Operation.update, name: 'object', selection: {test: selectedItemValue}, content: {test: 'bob'}
        }));
        expect(persistencePromise3.result.rowCount).toBe(1);

        let persistencePromise4 = await handler.addEvent(new Event({
            operation: Operation.delete, name: 'object', selection: {test: 'bob'}
        }));

        let persistencePromise5 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' }));

    } catch (error) {
        let persistencePromise6 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' }));
        console.log(persistencePromise6);
        let persistencePromise7 = await handler.readArray('object', {});
        expect(persistencePromise7.result.rowCount).toBe(0);
        await read.close();
        await write.close();
        console.error(error);
        expect(error).toBe(null);
        done();
    }
    await read.close();
    await write.close();
    done();
});
