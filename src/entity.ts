import Model from "./archimate-model";
import Documentation from "./documentation";
import Property from "./property";

export interface IEntity {
    readonly id: string;
    readonly name?: string;
    readonly href?: string;
    readonly documentation?: Documentation[];
    readonly properties?: Property[];
    readonly type: string;  // Model, Element, Relationship, or View
}

export default class Entity {
    public readonly id: string;
    public readonly name?: string;
    public readonly href?: string;
    public readonly documentation?: Documentation[];
    public readonly properties?: Property[];
    public readonly type: string;
    private normalized: boolean;

    constructor(args: IEntity) {
        this.id = args.id;
        this.name = args.name || "";
        this.href = args.href || `#${this.id}`;
        this.documentation = args.documentation || [];
        this.properties = args.properties || [];
        this.type = args.type;
        this.normalized = false;
    }

    public normalize(model: Model, depth = 2): Entity {
        this.normalized = true;
        return this;
    }

    public isNormalized(): boolean {
        return this.normalized;
    }
}
