import DAOModel from '../../model/dAOModel';
import DAOSimpleModel from '../../model/dAOSimpleModel';

export default interface DAOStoreAdapter {
  store(content: DAOSimpleModel): Promise<DAOModel>;
}
