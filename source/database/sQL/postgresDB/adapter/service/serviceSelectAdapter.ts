import ServiceModel from '../../model/serviceModel';

export default interface ServiceSelectAdapter {
  select(filter): Promise<Array<ServiceModel>>;
}
