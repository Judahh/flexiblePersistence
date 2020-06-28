import DAOModel from '../../model/dAOModel';
import DAOSimpleModel from '../../model/dAOSimpleModel';

export default interface DAOUpdateAdapter {
  update(id: string, content: DAOSimpleModel): Promise<DAOModel>;
}
