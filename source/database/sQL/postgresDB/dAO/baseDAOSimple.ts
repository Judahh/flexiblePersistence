/* eslint-disable @typescript-eslint/ban-ts-ignore */
import DAOSimpleAdapter from '../adapter/dAO/dAOSimpleAdapter';
import BaseDAOSelectAll from './baseDAOSelectAll';
import BaseDAOSelectById from './baseDAOSelectById';
import { Mixin } from 'ts-mixer';
// @ts-ignore
export default class BaseDAOSimple
  // @ts-ignore
  extends Mixin(BaseDAOSelectAll, BaseDAOSelectById)
  implements DAOSimpleAdapter {}
