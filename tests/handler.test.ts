import { Handler } from '../handler/handler';
import { DatabaseInfo } from '../database/databaseInfo';
import { Operation } from '../event/operation';
import { Event } from '../event/event';
import { MongoDB } from '../database/noSQL/mongoDB/mongoDB';
import { PostgresDB } from '../database/sQL/postgresDB/postgresDB';

test('add and read array and find object', done => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    handler.addEvent(new Event({operation: Operation.add, name: 'object', content: obj}), (error0, result0) => {
        expect(error0).toBe(null);
        handler.readArray('object', {}, (error1, result1) => {
            expect(error1).toBe(null);
            let ok = false;
            for (let index = 0; index < result1.length; index++) {
                const element = result1[index];
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            handler.addEvent(new Event({operation: Operation.clear, name: 'object'}), (error2, result2) => {
                expect(error2).toBe(null);
                expect(ok).toBe(true);
                done();
            });
        });
    });
});

test('add and read array and find object', done => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    handler.addEvent(new Event({operation: Operation.add, name: 'object', content: obj}), (error0, result0) => {
        expect(error0).toBe(null);
        handler.readArray('object', {}, (error1, result1) => {
            expect(error1).toBe(null);
            let ok = false;
            for (let index = 0; index < result1.length; index++) {
                const element = result1[index];
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            handler.addEvent(new Event({operation: Operation.clear, name: 'object'}), (error2, result2) => {
                expect(error2).toBe(null);
                expect(ok).toBe(true);
                done();
            });
        });
    });
});

test('add and read object', done => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(read, write);
    let obj = new Object;
    obj['test'] = 'test';
    handler.addEvent(new Event({operation: Operation.add, name: 'object', content: obj}), (error0, result0) => {
        expect(error0).toBe(null);
        handler.readItemById('object', result0._id, (error1, result1) => {
            expect(error1).toBe(null);
            let ok = (result1['test'] === obj['test']);
            handler.addEvent(new Event({operation: Operation.clear, name: 'object'}), (error2, result2) => {
                expect(error2).toBe(null);
                expect(ok).toBe(true);
                done();
            });
        });
    });
});

test('add and read array and find object', done => {
    let read = new PostgresDB(new DatabaseInfo('postgres', process.env.POSTGRES_HOST || 'localhost', (+process.env.POSTGRES_PORT) || 5432));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    console.log(process.env.POSTGRES_HOST);
    console.log(process.env.MONGO_HOST);
    console.log(process.env.POSTGRES_PORT);
    console.log(process.env.MONGO_PORT);

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    handler.addEvent(new Event({operation: Operation.add, name: 'object', content: obj}), (error0, result0) => {
        expect(error0).toBe(undefined);
        handler.readArray('object', {}, (error1, result1) => {
            expect(error1).toBe(undefined);
            let ok = false;
            for (let index = 0; index < result1.length; index++) {
                const element = result1[index];
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            handler.addEvent(new Event({operation: Operation.clear, name: 'object'}), (error2, result2) => {
                expect(error2).toBe(undefined);
                expect(ok).toBe(true);
                done();
            });
        });
    });
});