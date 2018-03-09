export interface PersistenceAdapter {
	updateItem(array: string, item, callback);

	readArray(array: string, item, callback);

	deleteArray(array: string, callback);

	addItem(array: string, item, callback);

	deleteItem(array: string, item, callback);
}
