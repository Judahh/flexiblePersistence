import ServiceModel from '../../model/serviceModel';
import ServiceSimpleModel from '../../model/serviceSimpleModel';

export default interface ServiceUpdateAdapter {
  update(id: string, content: ServiceSimpleModel): Promise<ServiceModel>;
}
