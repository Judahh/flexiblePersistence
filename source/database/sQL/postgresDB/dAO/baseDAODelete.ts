import DAODeleteAdapter from '../adapter/dAO/dAODeleteAdapter';
import BaseDAODefault from './baseDAODefault';

export default class BaseDAODelete extends BaseDAODefault
  implements DAODeleteAdapter {
  public delete(id: string): Promise<boolean> {
    // console.log(this.table);
    return new Promise((resolve, reject) => {
      this.pool.query(
        `DELETE FROM ${this.table} WHERE id = $1`,
        [id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result.rowCount) {
            return resolve(true);
          }
          // console.log(result);

          error = new Error();
          error.name = 'RemoveError';
          error.message = 'Unable to remove a non existent element.';
          return reject(error);
        }
      );
    });
  }
}
