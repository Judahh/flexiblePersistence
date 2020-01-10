export interface PersistenceAdapter {
addItem(array: string, item: any, callback?: any);
updateItem(array: string, item: any, callback?: any);
readArray(array: string, item: any, callback?: any);
readItem(array: string, item: any, callback?: any);
readItemById(array: string, id: any, callback?: any);
deleteArray(array: string, callback?: any);
deleteItem(array: string, item: any, callback?: any);
getDatabaseInfo();
}
