import { ModifyAdapter } from './modify/modifyAdapter';
import { ReadAdapter } from './read/readAdapter';

export interface SRARAdapter extends ModifyAdapter, ReadAdapter {}
