import DAOSimpleModel from '../model/dAOSimpleModel';
import BaseDAODefault from './baseDAODefault';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default class BaseDAORestrictedDefault extends BaseDAODefault {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  protected abstract async generateVectorValues(
    content: DAOSimpleModel
  ): Promise<Array<unknown>>;
}
