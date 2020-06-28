import ServiceSelectAllAdapter from './serviceSelectAllAdapter';
import ServiceSelectByIdAdapter from './serviceSelectByIdAdapter';
import ServiceStoreAdapter from './serviceStoreAdapter';
import ServiceUpdateAdapter from './serviceUpdateAdapter';
import ServiceDeleteAdapter from './serviceDeleteAdapter';

export default interface ServiceAdapter
  extends ServiceSelectAllAdapter,
    ServiceSelectByIdAdapter,
    ServiceStoreAdapter,
    ServiceUpdateAdapter,
    ServiceDeleteAdapter {}
