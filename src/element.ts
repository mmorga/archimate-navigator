import Model from "./archimate-model";
import Diagram, {IHasViews} from "./diagram";
import Entity, {IEntity} from "./entity";
import Relationship, {IHasRelationships} from "./relationship";

export interface IElement extends IEntity {
    readonly elementType: string;
    readonly relationships?: string[];
    readonly views?: string[];
}

export default class Element extends Entity implements IHasRelationships, IHasViews {
    public readonly elementType: string;
    public relationships: Relationship[];
    public views: Diagram[];
    private relationshipIds: string[];
    private viewIds: string[];

    constructor(args: IElement) {
        super(args);
        this.elementType = args.elementType;
        this.relationshipIds = args.relationships || [];
        this.viewIds = args.views || [];
        this.relationships = [];
        this.views = [];
    }

    public normalize(model: Model, depth = 2): Element {
        if (this.isNormalized() && depth <= 0) {
            return this;
        }
        this.relationships = this.relationshipIds.map((id) => model.relationship(id, depth - 1));
        this.views = this.viewIds.map((id) => model.diagram(id, depth - 1));
        super.normalize(model);
        return this;
    }
}
