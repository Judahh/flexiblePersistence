import ServiceModel from '../../model/serviceModel';

export default interface ServiceSelectByIdAdapter {
  selectById(id: string): Promise<ServiceModel>;
}
