import DAOSimpleAdapter from './dAOSimpleAdapter';
import DAOStoreAdapter from './dAOStoreAdapter';
import DAOUpdateAdapter from './dAOUpdateAdapter';

export default interface DAORestrictedAdapter
  extends DAOSimpleAdapter,
    DAOStoreAdapter,
    DAOUpdateAdapter {}
