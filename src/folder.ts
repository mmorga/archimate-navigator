import Model from "./archimate-model";
import Diagram from "./diagram";
import Entity, {IEntity} from "./entity";

export interface IFolder extends IEntity {
    readonly folders?: IFolder[];
    readonly diagrams?: string[];
}

export default class Folder extends Entity {
    public folders: Folder[];
    public diagrams: Diagram[];
    private readonly diagramIds: string[];
    private readonly iFolders: IFolder[];

    constructor(args: IFolder) {
        super(args);
        this.folders = [];
        this.iFolders = args.folders || [];
        this.diagrams = [];
        this.diagramIds = args.diagrams || [];
    }

    public normalize(model: Model): Folder {
        if (this.isNormalized()) {
            return this;
        }
        this.folders = this.iFolders.map((iFolder) => (new Folder(iFolder).normalize(model))).sort(this.sortByName);
        this.diagrams = this.diagramIds.map((id) => (model.diagram(id, 0))).sort(this.sortByName);
        super.normalize(model);
        return this;
    }

    private sortByName(a: any, b: any): number {
        return a.name.localeCompare(b.name);
    }
}
