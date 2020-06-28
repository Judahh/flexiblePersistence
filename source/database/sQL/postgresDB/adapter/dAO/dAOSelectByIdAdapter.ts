import DAOModel from '../../model/dAOModel';

export default interface DAOSelectByIdAdapter {
  selectById(id: string): Promise<DAOModel>;
}
