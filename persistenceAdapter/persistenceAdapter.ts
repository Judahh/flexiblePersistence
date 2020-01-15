export interface PersistenceAdapter {
    addItem(scheme: string, item: any, callback?: any);
    updateItem(scheme: string, selectedItem: any, item: any, callback?: any);
    readArray(scheme: string, selectedItem: any, callback?: any);
    readItem(scheme: string, selectedItem: any, callback?: any);
    readItemById(scheme: string, id: any, callback?: any);
    deleteArray(scheme: string, selectedItem: any, callback?: any);
    deleteItem(scheme: string, selectedItem: any, callback?: any);
    getDatabaseInfo();
}
