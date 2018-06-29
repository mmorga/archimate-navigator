import Model from "./archimate-model";
import Element from "./element";
import Entity, {IEntity} from "./entity";
import Relationship, {IHasRelationships} from "./relationship";

export interface IHasViews {
    readonly views: Diagram[];
}

export interface IDiagram extends IEntity {
    readonly viewpoint?: string;
    readonly elements?: string[];
    readonly relationships?: string[];
    readonly views?: string[];
    readonly path: string;
}

export default class Diagram extends Entity implements IHasRelationships {
    public readonly viewpoint: string;
    public elements: Element[];
    public relationships: Relationship[];
    public views: Diagram[];
    public readonly path: string;
    private elementIds: string[];
    private relationshipIds: string[];
    private viewIds: string[];

    constructor(args: IDiagram) {
        super(args);
        this.viewpoint = args.viewpoint || "Total";
        this.elementIds = args.elements || [];
        this.relationshipIds = args.relationships || [];
        this.viewIds = args.views || [];
        this.path = args.path || `svg/${args.id}.svg`;
    }

    public normalize(model: Model, depth = 2): Diagram {
        if (this.isNormalized() && depth < 0) {
            return this;
        }
        this.elements = this.elementIds.map((id) => model.element(id, depth - 1));
        this.relationships = this.relationshipIds.map((id) => model.relationship(id, depth - 1));
        this.views = this.viewIds.map((id) => model.diagram(id, depth - 1));
        super.normalize(model);
        return this;
    }
}
