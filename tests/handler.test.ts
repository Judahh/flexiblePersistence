import { Handler } from '../handler/handler';
import { DatabaseInfo } from '../database/databaseInfo';
import { Operation } from '../event/operation';
import { Event } from '../event/event';
import { MongoDB } from '../database/noSQL/mongoDB/mongoDB';
import { PostgresDB } from '../database/sQL/postgresDB/postgresDB';

test('add and read array and find object', async (done) => {
    let read = new MongoDB(new DatabaseInfo('read', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    let persistencePromise = await handler.addEvent(
        new Event({ operation: Operation.add, name: 'object', content: obj })
    ).catch(async (error) => {
        expect(error).toBe(null);
        await read.close();
        await write.close();
        done();
    });

    if (persistencePromise) {
        let persistencePromise1 = await handler.readArray('object', {}).catch(async (error) => {
            expect(error).toBe(null);
            await read.close();
            await write.close();
            done();
        });


        if (persistencePromise1) {
            let ok = false;
            for (let index = 0; index < persistencePromise1.receivedItem.length; index++) {
                const element = persistencePromise1.receivedItem[index];
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            let persistencePromise2 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' })).
                catch(async (error) => {
                    expect(error).toBe(null);
                    await read.close();
                    await write.close();
                    done();
                }
            );
            if (persistencePromise2) {
                expect(ok).toBe(true);
            }
        }
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
    let persistencePromise = await handler.addEvent(
        new Event({ operation: Operation.add, name: 'object', content: obj })
    ).catch(async (error) => {
        expect(error).toBe(null);
        await read.close();
        await write.close();
        done();
    });

    if (persistencePromise) {
        let persistencePromise1 = await handler.readItemById('object', persistencePromise.receivedItem._id).catch(async (error) => {
            expect(error).toBe(null);
            await read.close();
            await write.close();
            done();
        });

        if (persistencePromise1) {
            let ok = (persistencePromise1.receivedItem['test'] === obj['test']);
            let persistencePromise2 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' })).
                catch(async (error) => {
                    expect(error).toBe(null);
                    await read.close();
                    await write.close();
                    done();
                }
            );
            if (persistencePromise2) {
                expect(ok).toBe(true);
            }
        }
    }
    await read.close();
    await write.close();
    done();
});

test('add and read array and find object', async (done) => {
    let read = new PostgresDB(new DatabaseInfo('postgres', process.env.POSTGRES_HOST || 'localhost',
        (+process.env.POSTGRES_PORT) || 5432, process.env.POSTGRES_USER));
    let write = new MongoDB(new DatabaseInfo('write', process.env.MONGO_HOST || 'localhost', (+process.env.MONGO_PORT)));

    console.log('USER:', process.env.POSTGRES_USER);

    let handler = new Handler(write, read);
    let obj = new Object;
    obj['test'] = 'test';
    let persistencePromise = await handler.addEvent(
        new Event({ operation: Operation.add, name: 'object', content: obj })
    ).catch(async (error) => {
        expect(error).toBe(null);
        await read.close();
        await write.close();
        done();
    });

    if (persistencePromise) {
        let persistencePromise1 = await handler.readArray('object', {}).catch(async (error) => {
            expect(error).toBe(null);
            await read.close();
            await write.close();
            done();
        });


        if (persistencePromise1) {
            let ok = false;
            for (let index = 0; index < persistencePromise1.receivedItem.length; index++) {
                const element = persistencePromise1.receivedItem[index];
                if (element['test'] === obj['test']) {
                    ok = true;
                }
            }
            let persistencePromise2 = await handler.addEvent(new Event({ operation: Operation.clear, name: 'object' })).
                catch(async (error) => {
                    expect(error).toBe(null);
                    await read.close();
                    await write.close();
                    done();
                }
            );
            if (persistencePromise2) {
                expect(ok).toBe(true);
            }
        }
    }
    await read.close();
    await write.close();
    done();
});
