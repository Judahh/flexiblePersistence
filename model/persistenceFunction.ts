export class PersistenceFunction {
    private name: string;
    private statements: Array<string>;

    constructor(name: string, statements?: Array<string>) {
        this.name = name;
        this.statements = statements;
    }

    public toString() {
        return `${this.name}(${this.statements.toString()})`
    }
}
