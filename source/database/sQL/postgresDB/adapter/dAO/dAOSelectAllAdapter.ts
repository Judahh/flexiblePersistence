import DAOModel from '../../model/dAOModel';

export default interface DAOSelectAllAdapter {
  selectAll(): Promise<Array<DAOModel>>;
}
