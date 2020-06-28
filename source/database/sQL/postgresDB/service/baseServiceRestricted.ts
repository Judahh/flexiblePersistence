/* eslint-disable @typescript-eslint/ban-ts-ignore */
import ServiceRestrictedAdapter from '../adapter/controller/controllerRestrictedAdapter';
import BaseServiceSelectById from './baseServiceSelectById';
import BaseServiceSelectAll from './baseServiceSelectAll';
import { Mixin } from 'ts-mixer';
// @ts-ignore
export default class BaseServiceRestricted
  // @ts-ignore
  extends Mixin(BaseServiceSelectById, BaseServiceSelectAll)
  implements ServiceRestrictedAdapter {}
