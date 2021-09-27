export default interface IOptions {
  isInSeries: boolean;
  drop: {
    existent: boolean;
    create: boolean;
    read: boolean;
    correct: boolean;
    update: boolean;
    nonexistent: boolean;
    delete: boolean;
    other: boolean;
  };
}
