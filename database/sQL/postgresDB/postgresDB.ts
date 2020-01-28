import { PersistenceAdapter } from '../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { Pool } from 'pg';
import { PersistencePromise } from '../../../persistenceAdapter/persistencePromise';
export class PostgresDB implements PersistenceAdapter {
    private databaseInfo: DatabaseInfo;
    private pool: Pool;

    private static getDBVariableIndex(element: string, index: number, array: string[], initial: number): string {
        return ('$' + (index + initial));
    }

    private static getDBVariableSetIndex(element: string, index: number, array: string[], initial: number): string {
        return element + ' = ' + PostgresDB.getDBVariableIndex(element, index, array, initial);
    }

    private static querySelectArray(scheme, selectedKeys, selectVar?) {
        if (!selectVar) {
            selectVar = '*';
        }
        return (selectedKeys.length === 0) ?
                `SELECT ${selectVar} FROM ${scheme} ORDER BY _id ASC` : `SELECT ${selectVar} FROM ${scheme} WHERE (${selectedKeys.map((element, index, array) => {
                    return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
                }
                ).join(', ')}) ORDER BY _id ASC`;
    }

    private static querySelectItem(scheme, selectedKeys, selectVar?) {
        return PostgresDB.querySelectArray(scheme, selectedKeys, selectVar) + ` LIMIT 1`;
    }

    constructor(databaseInfo: DatabaseInfo) {
        this.databaseInfo = databaseInfo;
        this.pool = new Pool(this.databaseInfo);
    }

    public addItem(scheme: string, item: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let keys = Object.keys(item);
            let values = Object.values(item);
            let query = (`INSERT INTO ${scheme} (${keys.join(', ')}) VALUES (${keys.map((element, index, array) => {
                return PostgresDB.getDBVariableIndex(element, index, array, 1)
            }).join(', ')})`);
            this.pool.query(
                query,
                values,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                sentItem: item
                            })
                        );
                    }
                }
            );
        });
    }

    public updateItem(scheme: string, selectedItem: any, item: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
            let keys = Object.keys(item);
            let values = Object.values(item);
            let selectedKeys = Object.keys(selectedItem);
            let selectedValues = Object.values(selectedItem);
            let query = (`UPDATE ${scheme} SET ${keys.map((element, index, array) => {
                return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
            }).join(', ')} WHERE (${selectedKeys.map((element, index, array) => {
                return PostgresDB.getDBVariableSetIndex(element, index, array, 1 + keys.length)
            }
            ).join(', ')})`);
            this.pool.query(
                query,
                values.concat(selectedValues),
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: selectedItem,
                                sentItem: item
                            })
                        );
                    }
                }
            );
        });
    }

    public readArray(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
            let selectedKeys = Object.keys(selectedItem);
            let selectedValues = (selectedKeys.length === 0) ?
                undefined : Object.values(selectedItem);
            let query = PostgresDB.querySelectArray(scheme, selectedKeys);
            this.pool.query(
                query,
                selectedValues,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: selectedItem
                            })
                        );
                    }
                }
            );
        });
    }

    public readItem(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
            let selectedKeys = Object.keys(selectedItem);
            let selectedValues = (selectedKeys.length === 0) ?
                undefined : Object.values(selectedItem);
            let query = PostgresDB.querySelectItem(scheme, selectedKeys);
            this.pool.query(
                query,
                selectedValues,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: selectedItem
                            })
                        );
                    }
                }
            );
        });
    }

    public readItemById(scheme: string, id: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let selectedValues = [id];
            let query = `SELECT * FROM ${scheme} WHERE _id = $1`;
            this.pool.query(
                query,
                selectedValues,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: id
                            })
                        );
                    }
                }
            );
        });
    }

    public deleteItem(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
            let selectedKeys = Object.keys(selectedItem);
            let selectedValues = (selectedKeys.length === 0) ?
                undefined : Object.values(selectedItem);
            let query = `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectItem(scheme, selectedKeys, '_id')})`;
            this.pool.query(
                query,
                selectedValues,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: selectedItem
                            })
                        );
                    }
                }
            );
        });
    }

    public deleteArray(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
            let selectedKeys = Object.keys(selectedItem);
            let selectedValues = (selectedKeys.length === 0) ?
                undefined : Object.values(selectedItem);
            let query = `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectArray(scheme, selectedKeys, '_id')})`;
            this.pool.query(
                query,
                selectedValues,
                (error, results) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(
                            new PersistencePromise({
                                receivedItem: (results === undefined) ? undefined : results.rows,
                                result: results,
                                selectedItem: selectedItem
                            })
                        );
                    }
                }
            );
        });
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }

    public getPool() { // TODO: remove
        return this.pool;
    }

    public close(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.pool.end((error) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve();
                }
            });
        });
    }
}
