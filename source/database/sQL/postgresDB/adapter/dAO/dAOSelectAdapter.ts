import DAOModel from '../../model/dAOModel';

export default interface DAOSelectAdapter {
  select(filter): Promise<Array<DAOModel>>;
}
