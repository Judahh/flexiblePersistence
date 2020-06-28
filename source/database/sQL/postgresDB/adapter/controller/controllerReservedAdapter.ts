import ControllerStoreAdapter from './controllerStoreAdapter';
import ControllerUpdateAdapter from './controllerUpdateAdapter';
import ControllerDeleteAdapter from './controllerDeleteAdapter';

export default interface ControllerReservedAdapter
  extends ControllerStoreAdapter,
    ControllerUpdateAdapter,
    ControllerDeleteAdapter {}
