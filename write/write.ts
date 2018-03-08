import { Operation } from './../event/operation';
import { EventDB } from './../database/eventDB/eventDB';
import { Event } from './../event/event';
import { Read } from './../read/read';
import * as MongoDB from 'mongodb';
import { Database } from '../database/database';
export class Write {
    private read: Read;
    private eventDB: EventDB;

    constructor(database: Database, database2?: Database) {
        this.read = new Read(database);
        if (database2 === undefined) {
            database2 = JSON.parse(JSON.stringify(database));
            database.database = database.database + 'ReadDB';
            database2.database = database2.database + 'EventDB';
        }

        this.read = new Read(database);
        this.eventDB = new EventDB(database2);
    }

    public getRead(): Read {
        return this.read;
    }

    public addEvent(event: Event) {
        this.eventDB.addItem('events', event, (error, result) => {
            console.log('RESULT EVENT ON ' + this.eventDB.getDatabase());
            if (error) {
                console.error(error);
            } else {
                console.log(result);
                this.read.newEvent(event);
            }
        });
    }
}
