import { MongoDB } from './../noSQL/mongoDB/mongoDB';
import { Database } from '../database';
export class ReadDB extends MongoDB {

    constructor(database: Database) {
        super(database);
    }
}
