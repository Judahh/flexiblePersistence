export class PersistenceFunction {
  private name: string;
  private statements: Array<string>;

  constructor(name: string, statements?: Array<string>) {
    this.name = name;
    if (statements) {
      this.statements = statements;
    } else {
      this.statements = [];
    }
  }

  public toString(): string {
    return `${this.name}(${this.statements.toString()})`;
  }
}
