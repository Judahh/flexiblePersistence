import DAORestrictedAdapter from './dAORestrictedAdapter';
import DAODeleteAdapter from './dAODeleteAdapter';

export default interface DAOAdapter
  extends DAORestrictedAdapter,
    DAODeleteAdapter {}
