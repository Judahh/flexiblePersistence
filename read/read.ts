import { ReadDB } from "./../database/readDB/readDB";
import { Event } from "./../event/event";
import { Operation } from "./../event/operation";
import * as MongoDB from "mongodb";
export class Read {
    private readDB: ReadDB;
    private readMongoDB: MongoDB.Db;
    private objects: MongoDB.Collection;
    private static instance: Read = new Read();

    constructor() {
        this.readDB = ReadDB.getInstance();
        if (Read.instance) {
            throw new Error("The Read is a singleton class and cannot be created!");
        }

        Read.instance = this;
    }

    public static getInstance(): Read {
        return Read.instance;
    }

    public newEvent(event: Event) {
        switch (event.getOperation()) {
            case Operation.add:
                this.create(event);
                break;

            case Operation.read:
                // this.read(event);
                break;

            case Operation.correct:
            case Operation.update:
                this.update(event);
                break;

            case Operation.delete:
            case Operation.nonexistent:
                this.delete(event);
                break;
        }
    }

    private create(event: Event) {
        this.readDB.addItem(event.getName(), event.getContent(), (error, result) => {
            console.log("RESULT CREATE ON:" + this.readDB.getDatabase());
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }

    public readArray(array: string, callback) {
        this.readDB.readArray(array, callback);
    }    

    private update(event: Event) {
        this.readDB.updateItem(event.getName(), event.getContent(), function (error, result) {
            console.log("RESULT UPDATE");
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }

    private delete(event: Event) {
        this.readDB.deleteItem(event.getName(), event.getContent(), function (error, result) {
            console.log("RESULT DELETE");
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }
}