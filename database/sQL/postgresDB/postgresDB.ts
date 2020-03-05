import { PersistenceAdapter } from '../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { Pool } from 'pg';
import { PersistencePromise } from '../../../persistenceAdapter/persistencePromise';
import { RelationValuePostgresDB } from './relationValuePostgresDB';
import { SelectedItemValue } from '../../../model/selectedItemValue';
export class PostgresDB implements PersistenceAdapter {
    private databaseInfo: DatabaseInfo;
    private pool: Pool;

    private static inspectSelectedItemValue(element: any): SelectedItemValue {
        if (!(element instanceof SelectedItemValue)) {
            element = new SelectedItemValue(<string> element, new RelationValuePostgresDB());
        }
        return element;
    }

    private static getDBVariable(element: SelectedItemValue, index: number, array: string[]): string {
        return ('' + element.toString() + '');
    }

    private static getDBSetVariable(name, element: any, index: number, array: string[]): string {
        return name + ' ' + PostgresDB.getDBVariable(PostgresDB.inspectSelectedItemValue(element), index, array);
    }

    private static getDBSetVariables(item) {
        let keys = PostgresDB.resolveKeys(item);
        return keys.map((element, index, array) => {
            return PostgresDB.getDBSetVariable(element, item[element], index, array)
        });
    }

    private static getDBVariables(item) {
        return PostgresDB.resolveValues(item).map((element, index, array) => {
            return '\'' + PostgresDB.getDBVariable(element, index, array) + '\''
        }).join(', ');
    }

    private static querySelectArray(scheme: string, selectedItem: any, selectVar?: string) {
        if (!selectVar) {
            selectVar = '*';
        }
        return (PostgresDB.resolveKeys(selectedItem).length === 0) ?
            `SELECT ${selectVar} FROM ${scheme} ORDER BY _id ASC` : `SELECT ${selectVar} FROM ${scheme} WHERE (${
                PostgresDB.getDBSetVariables(selectedItem).join(', ')
            }) ORDER BY _id ASC`;
    }

    private static querySelectItem(scheme: string, selectedItem: any, selectVar?: string) {
        return PostgresDB.querySelectArray(scheme, selectedItem, selectVar) + ` LIMIT 1`;
    }

    private static queryInsertItem(scheme: string, item: any) {
        return (`INSERT INTO ${scheme} (${PostgresDB.resolveKeys(item).join(', ')}) VALUES (${
            PostgresDB.getDBVariables(item)
        })`);
    }

    private static queryUpdateItem(scheme: string, selectedItem: any, item: any) {
        return (`UPDATE ${scheme} SET ${
            PostgresDB.getDBSetVariables(item).join(', ')
        } WHERE (${
            PostgresDB.getDBSetVariables(selectedItem).join(', ')
        })`);
    }

    private static queryDeleteItem(scheme: string, selectedItem: any) {
        return `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectItem(scheme, selectedItem, '_id')})`;
    }

    private static queryDeleteArray(scheme: string, selectedItem: any) {
        return `DELETE FROM ${scheme} WHERE _id IN (${PostgresDB.querySelectArray(scheme, selectedItem, '_id')})`;
    }

    private static resolveKeys(item: any) {
        return (item) ? Object.keys(item) : [];
    }

    private static resolveValues(item: any): Array<any> {
        return (item) ? Object.values(item) : [];
    }

    private static queryResults(error, results, resolve, reject, toPromise: { selectedItem?, sentItem?}){
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

    constructor(databaseInfo: DatabaseInfo) {
        this.databaseInfo = databaseInfo;
        this.pool = new Pool(this.databaseInfo);
    }

    public addItem(scheme: string, item: any) {
        let query = PostgresDB.queryInsertItem(scheme, item);
        return this.query(
            query,
            { sentItem: item }
        );
    }

    public updateItem(scheme: string, selectedItem: any, item: any) {
        let query = PostgresDB.queryUpdateItem(scheme, selectedItem, item);
        return this.query(
            query,
            { selectedItem: selectedItem, sentItem: item }
        );
    }

    public readArray(scheme: string, selectedItem: any) {
        let query = PostgresDB.querySelectArray(scheme, selectedItem);
        return this.query(
            query,
            { selectedItem: selectedItem }
        );
    }

    public readItem(scheme: string, selectedItem: any) {
        let query = PostgresDB.querySelectItem(scheme, selectedItem);
        return this.query(
            query,
            { selectedItem: selectedItem }
        );
    }

    public readItemById(scheme: string, id: any) {
        let query = PostgresDB.querySelectItem(scheme, { _id : id });
        return this.query(
            query,
            { selectedItem: { _id: id } }
        );
    }

    public deleteItem(scheme: string, selectedItem: any) {
        let query = PostgresDB.queryDeleteItem(scheme, selectedItem);
        return this.query(
            query,
            { selectedItem: selectedItem }
        );
    }

    public deleteArray(scheme: string, selectedItem: any) {
        let query = PostgresDB.queryDeleteArray(scheme, selectedItem);
        return this.query(
            query,
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
            this.end(resolve, reject);
        });
    }

    private end(resolve, reject){
        this.pool.end(() => {
            resolve();
        });
    }

    private query(query: string, toPromise: { selectedItem?, sentItem?}): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.pool.query(
                query,
                (error, results) => {
                    PostgresDB.queryResults(error, results, resolve, reject, toPromise);
                }
            );
        });
    }
}
