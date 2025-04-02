import { Diagram } from "./diagram";
import { Element } from "./element";
import {
  IEntity,
  IHasOrganizations,
  IIdentifiable,
  IModel,
} from "./interfaces";
import { Organization } from "./organization";
import { Property } from "./property";
import { Relationship } from "./relationship";

export type AdjacencyList = Map<Element, Relationship[]>;

// This is the root model type.
// It is a container for the elements, relationships, diagrams and
// organizations of the model.
export class Model implements IModel {
  // unique identifier of this model
  public id: string = "";
  // name of the model
  public name: string = "";
  // model documentation
  public documentation?: string;
  // model properties
  public properties: Property[];
  // model metadata
  public metadata?: Map<string, object>;
  // model elements
  public elements: Element[] = [];
  // model relationships
  public relationships: Relationship[] = [];
  // model organization tree (aka Folders)
  public organizations: Organization[] = [];
  // property definitions
  public propertyDefs: Map<string, IIdentifiable> = new Map<
    string,
    IIdentifiable
  >();
  public version?: string;
  public diagrams: Diagram[] = [];
  public viewpoints: IIdentifiable[] = [];
  public href?: string | undefined;
  public type: string;

  private indexHash: Map<string, IEntity>;

  constructor() {
    this.indexHash = emptyIndexHash();
    this.properties = [];
    this.rebuildIndex();
    this.type = "Model";
  }

  public lookup(id: string | undefined): IEntity | undefined {
    if (id === undefined || id === "") {
      return undefined;
    }
    if (this.indexHash.get(id) === undefined) {
      this.rebuildIndex(id);
    }
    return this.indexHash.get(id);
  }

  public lookupDiagram(id: string | undefined): Diagram | undefined {
    const diagram = this.lookup(id);
    if (diagram === undefined) {
      return undefined;
    } else {
      return diagram as Diagram;
    }
  }

  public deleteDiagram(id: string): void {
    this.indexHash.delete(id);
    const index = this.diagrams.findIndex(
      (diagram: Diagram) => diagram.id == id,
    );
    if (index > -1) {
      // only splice array when item is found
      this.diagrams.splice(index, 1); // 2nd parameter means remove one item only
    }
    const idx2 = this.viewOrganization().items.indexOf(id);
    if (idx2 > -1) {
      // only splice array when item is found
      this.viewOrganization().items.splice(idx2, 1); // 2nd parameter means remove one item only
    }
  }

  public viewOrganization(): Organization {
    const viewOrg = this.organizations.find((o) =>
      o && o.type === "diagrams" ? true : false,
    );
    if (viewOrg) {
      return viewOrg;
    }
    if (this.organizations.length === 0) {
      const org = new Organization(this);
      org.name = "Diagrams";
      org.type = "diagrams";
      this.organizations.push(org);
    }
    return this.organizations[this.organizations.length - 1];
  }

  public entities(): IEntity[] {
    return Array.from(this.indexHash.values());
  }

  public toString() {
    return `Model<${this.id}>[${this.name}]`;
  }

  // TODO: write me
  public makeUniqueId() {
    return (Math.random() * 0xffffffff).toString(16);
    // while (true) {
    //   const uniqueId = (Math.random() * 0xffffffff).toString(16);
    //   if (this.indexHash.has(uniqueId)) {
    //     return uniqueId;
    //   }
    // }
  }

  public register(node: IEntity): void {
    this.indexHash.set(node.id, node);
  }

  public deregister(node: IEntity) {
    this.indexHash.delete(node.id);
  }

  public adjacencyList(): AdjacencyList {
    const list = new Map<Element, Relationship[]>();
    return this.elements.reduce(adjacencyListReducer, list);
  }

  private rebuildIndex(missingId?: string) {
    if (missingId === undefined) {
      return this;
    }
    this.indexHash = this.buildIndex();
    return this;
  }

  private buildIndex() {
    this.indexHash = emptyIndexHash();
    this.indexHash.set(this.id, this);
    this.elements.forEach((ref: IEntity) => {
      this.indexHash.set(ref.id, ref);
    });
    this.relationships.forEach((ref) => {
      this.indexHash.set(ref.id, ref);
    });
    this.diagrams.forEach((dia) => {
      this.indexHash.set(dia.id, this.indexViewNodes(dia));
    });
    // this.propertyDefs.forEach((ref) => { this.indexHash.set(ref.id, ref); });
    this.indexOrganizations(this);
    return this.indexHash;
  }

  private indexViewNodes(ref: Diagram): Diagram {
    ref.nodes.forEach((node) => this.indexHash.set(node.id, node));
    ref.connections.forEach((con) => this.indexHash.set(con.id, con));
    return ref;
  }

  private indexOrganizations(ref: IHasOrganizations) {
    ref.organizations.forEach((org) => {
      this.indexOrganizations(org);
      this.indexHash.set(org.id, org);
    });
    return ref;
  }
}

function emptyIndexHash() {
  return new Map<string, IEntity>();
}

function adjacencyListReducer(
  alMap: AdjacencyList,
  cv: Element,
): AdjacencyList {
  return alMap.set(cv, cv.relationships() as Relationship[]);
}
