import { PersistenceAdapter } from '../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { Pool } from 'pg';
export class Postgres implements PersistenceAdapter {
    private databaseInfo: DatabaseInfo;
    private pool: Pool;

    constructor(databaseInfo: DatabaseInfo) {
        this.databaseInfo = databaseInfo;
        this.pool = new Pool(this.databaseInfo);
    }

    private createStringAdd(object: Object) {
        let string = '';

        for (let i = 1; i <= Object.keys(object).length; i++) {
            if (string === '') {
                string = `$` + `${i}`;
            } else {
                string = `${string}` + ', ' + `$` + `${i}`;
            }
        }

        return string;
    }

    private createStringUpdate(object: Object) {
        let string = '';

        let array = Object.keys(object)

        for (let i = 1; i < Object.keys(object).length; i++) {
            if (string === '') {
                string = `${array[i]} = ` + `$` + `${i + 1}`;
            } else {
                string = `${string}` + ', ' + `${array[i]} = ` + `$` + `${i + 1}`;
            }
        }

        return string;
    }

    public addItem(array: string, item: any, callback?: any) {
        let string = this.createStringAdd(item)
        this.pool.query(
            `INSERT INTO ${array} (${Object.keys(item)}) VALUES (${string})`,
            Object.values(item),
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            })
    }

    public updateItem(array: string, item: any, callback?: any) {
        let string = this.createStringUpdate(item)

        this.pool.query(
            `UPDATE ${array} SET ${string} WHERE id = $1`,
            Object.values(item),
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            })
    }

    public readArray(array: string, item: any, callback?: any) {
        this.pool.query(
            `SELECT * FROM ${array} ORDER BY id ASC`,
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            })
    }

    public readItem(array: string, item: any, callback?: any) {
        let item_values = <Array<any>>Object.values(item);

        this.pool.query(
            `SELECT * FROM ${array} WHERE id = $1`,
            item_values[0],
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            });
    }

    public readItemById(array: string, id: any, callback?: any) {
        this.pool.query(
            `SELECT * FROM ${array} WHERE id = $1`,
            [id],
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, id, results)
            });
    }

    public deleteArray(array: string, item: any, callback?: any) {
        this.pool.query(
            `DROP TABLE ${array}`,
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            });
    }

    public deleteItem(array: string, item: any, callback?: any) {
        let item_values = <Array<any>>Object.values(item);

        this.pool.query(
            `DELETE FROM ${array} WHERE id = $1`,
            [item_values[0]],
            (error, results) => {
                if (error) {
                    throw error
                }
                callback(error, item, results)
            });
    }
    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
