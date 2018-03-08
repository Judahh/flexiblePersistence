import { MongoDB } from './../noSQL/mongoDB/mongoDB';
export class ReadDB extends MongoDB {

    constructor(name: string, host?: string, port?: number, username?: string, password?: string) {
        super(name + 'ReadDB', host, port, username, password);
    }
}
