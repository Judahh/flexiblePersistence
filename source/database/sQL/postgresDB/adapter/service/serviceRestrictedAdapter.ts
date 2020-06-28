import ServiceSelectAllAdapter from './serviceSelectAllAdapter';
import ServiceSelectByIdAdapter from './serviceSelectByIdAdapter';

export default interface ServiceRestrictedAdapter
  extends ServiceSelectAllAdapter,
    ServiceSelectByIdAdapter {}
