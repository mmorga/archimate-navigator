import Diagram, {IDiagram} from "./diagram";
import Element, {IElement} from "./element";
import Entity, {IEntity} from "./entity";
import Folder, {IFolder} from "./folder";
import Relationship, {IRelationship} from "./relationship";

export default class Model {
    public readonly entities: Entity[];
    public readonly folders: Folder[];

    constructor(entities: IEntity[], folders: IFolder[]) {
        this.entities = this.buildEntities(entities);
        this.folders = this.buildFolders(folders);
    }

    public entity(id: string, depth = 2): Entity | Element | Relationship | Diagram {
        const idx = this.entities.findIndex((e: Entity) => (e.id === id));
        let entity = this.entities[idx];
        if (idx === -1) {
            // throw new Error(`Entity not found for id ${id}`);
            entity = new Entity({id: "no-entity", type: "none"});
        }
        if (depth <= 0) {
            return entity;
        }
        let normalizedEntity = entity;
        if (!entity.isNormalized()) {
            normalizedEntity = entity.normalize(this, depth);
            this.entities[idx] = normalizedEntity;
        }
        return normalizedEntity;
    }

    public element(id: string, depth = 2): Element {
        const entity = this.entity(id, depth);
        if (entity instanceof Element) {
            return entity as Element;
        }
        throw new Error(`Expected an Element Entity for id ${id}, was: "${entity ? entity.type : "null"}"`);
    }

    public relationship(id: string, depth = 2): Relationship {
        const entity = this.entity(id, depth);
        if (entity instanceof Relationship) {
            return entity as Relationship;
        }
        throw new Error(`Expected a Relationship Entity for id ${id}, was: "${entity ? entity.type : "null"}"`);
    }

    public diagram(id: string, depth = 2): Diagram {
        const entity = this.entity(id, depth);
        if (entity instanceof Diagram) {
            return entity as Diagram;
        }
        throw new Error(`Expected a Diagram Entity for id ${id}, was: "${entity ? entity.type : "null"}"`);
    }

    private buildEntities(entities: IEntity[]): Entity[] {
        if (!entities) {
            return [];
        }

        return entities.map((entity) => this.entityFactory(entity));
    }

    private entityFactory(entity: IEntity): Entity {
        switch (entity.type) {
        case "Relationship":
            return new Relationship(entity as IRelationship);
        case "Element":
            return new Element(entity as IElement);
        case "Diagram":
            return new Diagram(entity as IDiagram);
        default:
            return new Entity(entity);
        }
    }

    private buildFolders(folders: IFolder[]): Folder[] {
        if (!folders) {
            return [];
        }
        return folders.map((folder) => {
            return (new Folder(folder)).normalize(this);
        }).sort(this.sortByName);
    }

    private sortByName(a: any, b: any): number {
        return a.name.localeCompare(b.name);
    }
}
