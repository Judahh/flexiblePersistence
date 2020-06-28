import DefaultInitializer from '../default/defaultInitializer';
import { Handler } from 'flexiblepersistence';

export default interface BaseServiceDefaultInitializer
  extends DefaultInitializer {
  handler: Handler;
}
