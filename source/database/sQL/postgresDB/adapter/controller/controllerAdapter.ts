import ControllerRestrictedAdapter from './controllerRestrictedAdapter';
import ControllerReservedAdapter from './controllerReservedAdapter';

export default interface ControllerAdapter
  extends ControllerRestrictedAdapter,
    ControllerReservedAdapter {}
