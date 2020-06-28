/* eslint-disable @typescript-eslint/ban-ts-ignore */
import DAORestrictedAdapter from '../adapter/dAO/dAORestrictedAdapter';
import BaseDAOSimple from './baseDAOSimple';
import BaseDAOStore from './baseDAOStore';
import BaseDAOUpdate from './baseDAOUpdate';
import { Mixin } from 'ts-mixer';
// @ts-ignore
export default class BaseDAORestricted
  // @ts-ignore
  extends Mixin(BaseDAOSimple, BaseDAOStore, BaseDAOUpdate)
  implements DAORestrictedAdapter {}
