import Model from "./archimate-model";
import Diagram from "./diagram";
import Element, {IElement} from "./element";
import Entity, {IEntity} from "./entity";

export interface IHasRelationships {
    relationships: Relationship[];
}

const NULL_ELEMENT_ARGS: IElement = {
    elementType: "none",
    id: "none",
    type: "none",
};

export interface IRelationship extends IEntity {
    readonly relationshipType: string;
    readonly source: string;   // id of entity
    readonly target: string;   // id of entity
    readonly views?: string[];  // ids of views
}

export default class Relationship extends Entity {
    public readonly relationshipType: string;
    public source: Element;   // id of entity
    public target: Element;   // id of entity
    public views: Diagram[];  // ids of views
    private readonly sourceId: string;
    private readonly targetId: string;
    private readonly viewIds: string[];
    constructor(args: IRelationship) {
        super(args);
        this.relationshipType = args.relationshipType;
        this.sourceId = args.source;
        this.targetId = args.target;
        this.viewIds = args.views || [];
        this.source = new Element(NULL_ELEMENT_ARGS);
        this.target = new Element(NULL_ELEMENT_ARGS);
        this.views = [];
    }

    public normalize(model: Model, depth = 2): Relationship {
        if (this.isNormalized() && depth <= 0) {
            return this;
        }
        this.views = this.viewIds.map((id) => model.diagram(id, depth - 1));
        this.source = model.element(this.sourceId, depth - 1);
        this.target = model.element(this.targetId, depth - 1);
        super.normalize(model);
        return this;
    }
}
