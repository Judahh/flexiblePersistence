import ServiceModel from '../../model/serviceModel';
import ServiceSimpleModel from '../../model/serviceSimpleModel';

export default interface ServiceStoreAdapter {
  store(content: ServiceSimpleModel): Promise<ServiceModel>;
}
