import { Handler } from 'flexiblepersistence';

export default interface DatabaseInitializer {
  eventHandler?: Handler;
  readPool?;
  hasMemory?: boolean;
}
