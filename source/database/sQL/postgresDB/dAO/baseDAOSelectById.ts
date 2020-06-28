import DAOModel from '../model/dAOModel';
import DAOSelectByIdAdapter from '../adapter/dAO/dAOSelectByIdAdapter';
import BaseDAODefault from './baseDAODefault';
export default class BaseDAOSelectById extends BaseDAODefault
  implements DAOSelectByIdAdapter {
  public async selectById(id: string): Promise<DAOModel> {
    const select = await this.generateSelect(this.table);
    return new Promise((resolve, reject) => {
      this.pool.query(
        `${select} WHERE element.id = $1 ${this.groupBy}`,
        [id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          result = this.fixType(result);
          return resolve(result.rows[0]);
        }
      );
    });
  }
}
