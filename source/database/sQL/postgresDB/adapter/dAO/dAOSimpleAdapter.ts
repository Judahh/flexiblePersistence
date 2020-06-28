import DAOSelectByIdAdapter from './dAOSelectByIdAdapter';
import DAOSelectAllAdapter from './dAOSelectAllAdapter';

export default interface DAOSimpleAdapter
  extends DAOSelectByIdAdapter,
    DAOSelectAllAdapter {}
