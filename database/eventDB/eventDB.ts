import { MongoDB } from './../noSQL/mongoDB/mongoDB';
export class EventDB extends MongoDB {
    constructor(name: string, host?: string, port?: number) {
        super(name + 'EventDB', host, port);
    }
}
