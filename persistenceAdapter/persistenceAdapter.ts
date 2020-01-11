export interface PersistenceAdapter {
addItem(scheme: string, item: any, callback?: any);
updateItem(scheme: string, item: any, callback?: any);
readArray(scheme: string, item: any, callback?: any);
readItem(scheme: string, item: any, callback?: any);
readItemById(scheme: string, id: any, callback?: any);
deleteArray(scheme: string, item: any, callback?: any);
deleteItem(scheme: string, item: any, callback?: any);
getDatabaseInfo();
}
