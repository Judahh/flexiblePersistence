import { Handler } from '../handler/handler';
import { DatabaseInfo } from '../database/databaseInfo';
import { Operation } from '../event/operation';
import { Event } from '../event/event';
import { MongoDB } from '../database/noSQL/mongoDB/mongoDB';


test('add and remove object', done => {
    let read = new MongoDB(new DatabaseInfo('read'));
    let write = new MongoDB(new DatabaseInfo('write'));

    let handler = new Handler(read, write);
    let obj = { test: 'test' };
    handler.addEvent(new Event(Operation.add, 'object', obj), (error, result) => {
        handler.readArray('object', {}, (error, data) => {
            let ok = false;
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                console.log('e:', element)
                console.log('t:', element.test)
                if (element.test === obj.test) {
                    ok = true;
                    break;
                }
            }
            expect(ok).toBe(true);
            done();
        });
    });
});
