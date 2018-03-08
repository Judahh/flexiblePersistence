import { MongoDB } from './../noSQL/mongoDB/mongoDB';
export class ReadDB extends MongoDB {

    constructor(name: string, host?: string, port?: number) {
        super(name + 'ReadDB', host, port);
    }
}
