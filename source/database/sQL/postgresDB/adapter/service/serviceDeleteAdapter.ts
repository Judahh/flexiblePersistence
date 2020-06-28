export default interface ServiceDeleteAdapter {
  delete(id: string): Promise<boolean>;
}
