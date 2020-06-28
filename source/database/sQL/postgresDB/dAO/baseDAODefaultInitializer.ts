import DefaultInitializer from '../default/defaultInitializer';

export default interface BaseDAODefaultInitializer extends DefaultInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pool: any;
}
