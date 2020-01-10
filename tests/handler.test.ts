import { Handler } from '../handler/handler';
import { DatabaseInfo } from '../database/databaseInfo';
import { Operation } from '../event/operation';
import { Event } from '../event/event';
import { MongoDB } from '../database/noSQL/mongoDB/mongoDB';


test('add and read array and find object', done => {
    let read = new MongoDB(new DatabaseInfo('read'));
    let write = new MongoDB(new DatabaseInfo('write'));

    let handler = new Handler(read, write);
    let obj = new Object;
    obj['test'] = 'test';
    handler.addEvent(new Event(Operation.add, 'object', obj), (error0, result0) => {
        handler.readArray('object', {}, (error1, result1) => {
            let ok = false;
            for (let index = 0; index < result1.length; index++) {
                const element = result1[index]._doc;
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            handler.addEvent(new Event(Operation.clear, 'object'), (error2, result2) => {
                expect(ok).toBe(true);
                done();
            });
        });
    });
});

test('add and read object', done => {
    let read = new MongoDB(new DatabaseInfo('read'));
    let write = new MongoDB(new DatabaseInfo('write'));

    let handler = new Handler(read, write);
    let obj = new Object;
    obj['test'] = 'test';
    console.log('o:', obj)
    handler.addEvent(new Event(Operation.add, 'object', obj), (error0, result0) => {
        console.log('result:', result0);
        console.log('o:', result0._id);
        handler.readById('object', result0._id, (error1, result1) => {
            let ok = (result1._doc['test'] === obj['test']);
            handler.addEvent(new Event(Operation.clear, 'object'), (error2, result2) => {
                expect(ok).toBe(true);
                done();
            });
        });
    });
});