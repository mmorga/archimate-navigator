import Model from "./archimate-model";
import Element from "./element";
import Entity, {IEntity} from "./entity";
import Relationship, {IHasRelationships} from "./relationship";

export interface IHasViews {
    readonly views: OldDiagram[];
}

export interface IDiagram extends IEntity {
    readonly viewpoint?: string;
    readonly elementIds?: string[];
    readonly relationshipIds?: string[];
    readonly viewIds?: string[];
    readonly path: string;
}

export default class OldDiagram extends Entity implements IHasRelationships, IDiagram {
    public readonly viewpoint: string;
    public elements: Element[];
    public relationships: Relationship[];
    public views: OldDiagram[];
    public readonly path: string;
    public elementIds: string[];
    public relationshipIds: string[];
    public viewIds: string[];

    constructor(args: IDiagram) {
        super(args);
        this.viewpoint = args.viewpoint || "Total";
        this.elements = [];
        this.relationships = [];
        this.views = [];
        this.elementIds = args.elementIds || [];
        this.relationshipIds = args.relationshipIds || [];
        this.viewIds = args.viewIds || [];
        this.path = args.path || `svg/${args.id}.svg`;
    }

    public normalize(model: Model, depth = 2): OldDiagram {
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
