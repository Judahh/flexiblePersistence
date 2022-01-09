export default interface IOptions {
  isInSeries?: boolean;
  drop?: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    other?: boolean;
  };
}
