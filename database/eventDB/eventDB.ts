import { MongoDB } from './../noSQL/mongoDB/mongoDB';
import { Database } from '../database';
export class EventDB extends MongoDB {
    constructor(database: Database) {
        super(database);
    }
}
