import ControllerSimpleAdapter from './controllerShowAdapter';
import ControllerIndexAdapter from './controllerIndexAdapter';

export default interface ControllerRestrictedAdapter
  extends ControllerSimpleAdapter,
    ControllerIndexAdapter {}
