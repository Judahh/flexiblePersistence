export default interface DAODeleteAdapter {
  delete(id: string): Promise<boolean>;
}
