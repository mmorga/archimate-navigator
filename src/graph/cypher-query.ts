export default class CypherQuery {
    public readonly name: string;
    public readonly query: string;

    constructor(name: string, query: string) {
        this.name = name;
        this.query = query;
    }
}
