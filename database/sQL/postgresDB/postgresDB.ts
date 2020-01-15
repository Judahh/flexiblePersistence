import { PersistenceAdapter } from '../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { Pool } from 'pg';
export class PostgresDB implements PersistenceAdapter {
    private databaseInfo: DatabaseInfo;
    private pool: Pool;

    private static getDBVariableIndex(element: string, index: number, array: string[], initial: number): string {
        return ('$' + (index + initial));
    }

    private static getDBVariableSetIndex(element: string, index: number, array: string[], initial: number): string {
        return element + ' = ' + PostgresDB.getDBVariableIndex(element, index, array, initial);
    }

    constructor(databaseInfo: DatabaseInfo) {
        this.databaseInfo = databaseInfo;
        this.pool = new Pool(this.databaseInfo);
    }

    public addItem(scheme: string, item: any, callback?: any) {
        let keys = Object.keys(item);
        let values = Object.values(item);
        let query = (`INSERT INTO ${scheme} (${keys.join(', ')}) VALUES (${keys.map((element, index, array) => {
            return PostgresDB.getDBVariableIndex(element, index, array, 1)
        }).join(', ')})`);
        this.pool.query(
            query,
            values,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, undefined, item);
            }
        )
    }

    public updateItem(scheme: string, selectedItem: any, item: any, callback?: any) {
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
                callback(error, (results === undefined) ? undefined : results.rows, results, selectedItem, item);
            }
        )
    }

    public readArray(scheme: string, selectedItem: any, callback?: any) {
        selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
        let selectedKeys = Object.keys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
        undefined : Object.values(selectedItem);
        let query = (selectedKeys.length === 0) ?
        `SELECT * FROM ${scheme} ORDER BY _id ASC` : `SELECT * FROM ${scheme} WHERE (${selectedKeys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
        }
        ).join(', ')}) ORDER BY _id ASC` ;
        this.pool.query(
            query,
            selectedValues,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, selectedItem, undefined);
            }
        )
    }

    public readItem(scheme: string, selectedItem: any, callback?: any) {
        selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
        let selectedKeys = Object.keys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
        undefined : Object.values(selectedItem);
        let query = (selectedKeys.length === 0) ?
        `SELECT * FROM ${scheme} ORDER BY _id ASC LIMIT 1` : `SELECT * FROM ${scheme} WHERE (${selectedKeys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
        }
        ).join(', ')}) ORDER BY _id ASC LIMIT 1` ;
        this.pool.query(
            query,
            selectedValues,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, selectedItem, undefined);
            }
        );
    }

    public readItemById(scheme: string, id: any, callback?: any) {
        let selectedValues = [id];
        let query = `SELECT * FROM ${scheme} WHERE _id = $1`;
        this.pool.query(
            query,
            selectedValues,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, id, undefined);
            }
        );
    }

    public deleteItem(scheme: string, selectedItem: any, callback?: any) {
        selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
        let selectedKeys = Object.keys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
        undefined : Object.values(selectedItem);
        let query = (selectedKeys.length === 0) ?
        `DELETE FROM ${scheme} LIMIT 1` : `DELETE FROM ${scheme} WHERE (${selectedKeys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
        }
        ).join(', ')}) LIMIT 1` ;
        this.pool.query(
            query,
            selectedValues,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, selectedItem, undefined);
            }
        );
    }

    public deleteArray(scheme: string, selectedItem: any, callback?: any) {
        selectedItem = (selectedItem === undefined || selectedItem === null) ? {} : selectedItem;
        let selectedKeys = Object.keys(selectedItem);
        let selectedValues = (selectedKeys.length === 0) ?
        undefined : Object.values(selectedItem);
        let query = (selectedKeys.length === 0) ?
        `DELETE FROM ${scheme} ` : `DELETE FROM ${scheme} WHERE (${selectedKeys.map((element, index, array) => {
            return PostgresDB.getDBVariableSetIndex(element, index, array, 1)
        }
        ).join(', ')})` ;
        this.pool.query(
            query,
            selectedValues,
            (error, results) => {
                callback(error, (results === undefined) ? undefined : results.rows, results, selectedItem, undefined);
            }
        );
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
