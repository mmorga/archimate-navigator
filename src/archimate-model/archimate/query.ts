import { Set } from "immutable";
import { Element } from "./element";
import { ElementType, ElementTypes } from "./element-type";
import { Model } from "./model";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { ViewpointType } from "./viewpoint-type";

interface IQueryUpdateProps {
  id?: string;
  model?: Model;
  name?: string;
  viewpoint?: ViewpointType;
  elements?: Set<Element>;
  elementTypes?: Set<ElementType>;
  relationships?: Set<Relationship>;
  relationshipTypes?: Set<RelationshipType>;
  pathDepth?: number;
}

export class Query {
  public id: string;
  public model: Model;
  public name: string;
  public viewpoint: ViewpointType;
  public elements: Set<Element>;
  public elementTypes: Set<ElementType>;
  public relationships: Set<Relationship>;
  public relationshipTypes: Set<RelationshipType>;
  public pathDepth: number;

  constructor(model: Model) {
    this.id = model.makeUniqueId();
    this.model = model;
    this.name = "New Query";
    this.viewpoint = ViewpointType.Total;
    this.elements = Set<Element>();
    this.elementTypes = Set<ElementType>(ElementTypes);
    this.relationships = Set<Relationship>();
    this.relationshipTypes = Set<RelationshipType>(RelationshipTypes);
    this.pathDepth = 3;
  }

  public updateQuery(props: IQueryUpdateProps): Query {
    return Object.assign(
      new Query(this.model),
      this,
      props
    );
  }

  // TODO: This should return a set based on 
  // * Selected Viewpoint
  // * Selected Layer
  // * Active/Passive Structure or Behavior
  public availableElementTypes(): Set<ElementType> {
    return Set<ElementType>(ElementTypes);
  }

  // Add this once Immutable v4 is released
  // public hashCode(): number {
  //   return hash(this);
  // }

  // public equals(other: any): boolean {
  //   return (
  //     (other instanceof Query) &&
  //     (this.id === other.id) &&
  //     (this.model === other.model) &&
  //     (this.name === other.name) &&
  //     (this.viewpoint === other.viewpoint) &&
  //     (this.elements === other.elements) &&
  //     (this.relationships === other.relationships) &&
  //     (this.pathDepth === other.pathDepth)
  //   );
  // }
}
