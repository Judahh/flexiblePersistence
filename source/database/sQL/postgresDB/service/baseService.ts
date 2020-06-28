/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Mixin } from 'ts-mixer';
import ServiceAdapter from '../adapter/service/serviceAdapter';
import BaseServiceRestricted from './baseServiceRestricted';
import BaseServiceReserved from './baseServiceReserved';
// @ts-ignore
export default abstract class BaseService
  extends Mixin(BaseServiceReserved, BaseServiceRestricted)
  implements ServiceAdapter {}
