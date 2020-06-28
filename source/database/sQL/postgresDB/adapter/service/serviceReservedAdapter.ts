import ServiceStoreAdapter from './serviceStoreAdapter';
import ServiceUpdateAdapter from './serviceUpdateAdapter';
import ServiceDeleteAdapter from './serviceDeleteAdapter';

export default interface ServiceReservedAdapter
  extends ServiceStoreAdapter,
    ServiceUpdateAdapter,
    ServiceDeleteAdapter {}
