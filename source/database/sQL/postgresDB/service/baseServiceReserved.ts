/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Mixin } from 'ts-mixer';
import ServiceReservedAdapter from '../adapter/controller/controllerReservedAdapter';
import BaseServiceStore from './baseServiceStore';
import BaseServiceDelete from './baseServiceDelete';
import BaseServiceUpdate from './baseServiceUpdate';
// @ts-ignore
export default class BaseServiceReserved
  // @ts-ignore
  extends Mixin(BaseServiceStore, BaseServiceDelete, BaseServiceUpdate)
  implements ServiceReservedAdapter {}
