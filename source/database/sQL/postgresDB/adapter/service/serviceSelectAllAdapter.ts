import ServiceModel from '../../model/serviceModel';

export default interface ServiceSimpleAdapter {
  selectAll(): Promise<Array<ServiceModel>>;
}
