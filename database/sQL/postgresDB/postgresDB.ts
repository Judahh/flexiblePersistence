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
        console.log('element:', element)
        console.log('index:', index)
        console.log('array:', array)
        console.log('initial:', initial)
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

    private static querySelectItemById(scheme, selectVar?) {
        if (!selectVar) {
            selectVar = '*';
        }
        return `SELECT ${selectVar} FROM ${scheme} WHERE _id = $1`;
    }

    private static queryInsertItem(scheme, keys) {
        return (`INSERT INTO ${scheme} (${keys.join(', ')}) VALUES (${keys.map((element, index, array) => {
            return PostgresDB.getDBVariableIndex(element, index, array, 1)
        }).join(', ')})`);
    }

    private static queryUpdateItem(scheme, keys, selectedKeys) {
        return (`UPDATE ${scheme} SET ${keys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
        }).join(', ')} WHERE (${selectedKeys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1 + keys.length)
        }
        ).join(', ')})`);
    }

    private static queryDeleteItem(scheme, selectedKeys) {
        return `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectItem(scheme, selectedKeys, '_id')})`;
    }

    private static queryDeleteArray(scheme, selectedKeys) {
        return `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectArray(scheme, selectedKeys, '_id')})`;
    }

    private static resolveSelectedItem(selectedItem?: any) {
        return (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
    }

    private static resolveSelectedKeys(selectedItem: any) {
        return Object.keys(selectedItem);
    }

    private static resolveSelectedValues(selectedItem: any) {
        return Object.values(selectedItem);
    }

    constructor(databaseInfo: DatabaseInfo) {
        this.databaseInfo = databaseInfo;
        this.pool = new Pool(this.databaseInfo);
    }

    public addItem(scheme: string, item: any) {
        let keys = Object.keys(item);
        let values = Object.values(item);
        let query = PostgresDB.queryInsertItem(scheme, keys);
        return this.query(
            query,
            values,
            { sentItem: item }
        );
    }

    public updateItem(scheme: string, selectedItem: any, item: any) {
        selectedItem = PostgresDB.resolveSelectedItem(selectedItem);
        let keys = Object.keys(item);
        let values = Object.values(item);
        let selectedKeys = PostgresDB.resolveSelectedKeys(selectedItem);
        let selectedValues = PostgresDB.resolveSelectedValues(selectedItem);
        let query = PostgresDB.queryUpdateItem(scheme, keys, selectedKeys);
        return this.query(
            query,
            values.concat(selectedValues),
            { selectedItem: selectedItem, sentItem: item }
        );
    }

    public readArray(scheme: string, selectedItem: any) {
        selectedItem = PostgresDB.resolveSelectedItem(selectedItem);
        let selectedKeys = PostgresDB.resolveSelectedKeys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
            undefined : Object.values(selectedItem);
        let query = PostgresDB.querySelectArray(scheme, selectedKeys);
        return this.query(
            query,
            selectedValues,
            { selectedItem: selectedItem }
        );
    }

    public readItem(scheme: string, selectedItem: any) {
        selectedItem = PostgresDB.resolveSelectedItem(selectedItem);
        let selectedKeys = PostgresDB.resolveSelectedKeys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
            undefined : Object.values(selectedItem);
        let query = PostgresDB.querySelectItem(scheme, selectedKeys);
        return this.query(
            query,
            selectedValues,
            { selectedItem: selectedItem }
        );
    }

    public readItemById(scheme: string, id: any) {
        let selectedValues = [id];
        let query = PostgresDB.querySelectItemById(scheme);
        return this.query(
            query,
            selectedValues,
            { selectedItem: { _id: id } }
        );
    }

    public deleteItem(scheme: string, selectedItem: any) {
        selectedItem = PostgresDB.resolveSelectedItem(selectedItem);
        let selectedKeys = PostgresDB.resolveSelectedKeys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
            undefined : Object.values(selectedItem);
        let query = PostgresDB.queryDeleteItem(scheme, selectedKeys);
        return this.query(
            query,
            selectedValues,
            { selectedItem: selectedItem }
        );
    }

    public deleteArray(scheme: string, selectedItem: any) {
        selectedItem = PostgresDB.resolveSelectedItem(selectedItem);
        let selectedKeys = PostgresDB.resolveSelectedKeys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
            undefined : Object.values(selectedItem);
        let query = PostgresDB.queryDeleteArray(scheme, selectedKeys);
        return this.query(
            query,
            selectedValues,
            { selectedItem: selectedItem }
        );
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

    private query(query, values, toPromise: { selectedItem?, sentItem?}): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
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
                                selectedItem: toPromise.selectedItem,
                                result: results,
                                sentItem: toPromise.sentItem
                            })
                        );
                    }
                }
            );
        });
    }
}
