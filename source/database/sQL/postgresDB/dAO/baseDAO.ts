/* eslint-disable @typescript-eslint/ban-ts-ignore */
import DAOAdapter from '../adapter/dAO/dAOAdapter';
import BaseDAORestricted from './baseDAORestricted';
import BaseDAODelete from './baseDAODelete';
import { Mixin } from 'ts-mixer';
// @ts-ignore
export default abstract class BaseDAO
  // @ts-ignore
  extends Mixin(BaseDAORestricted, BaseDAODelete)
  implements DAOAdapter {}
