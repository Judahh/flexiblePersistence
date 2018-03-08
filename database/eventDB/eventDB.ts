import { MongoDB } from './../noSQL/mongoDB/mongoDB';
export class EventDB extends MongoDB {
    constructor(name: string, host?: string, port?: number, username?: string, password?: string) {
        super(name + 'EventDB', host, port, username, password);
    }
}
