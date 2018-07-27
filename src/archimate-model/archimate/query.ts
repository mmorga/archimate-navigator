import { List, Set } from "immutable";
import { Element } from "./element";
import { Model } from "./model";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { ViewpointType } from "./viewpoint-type";

export class Query {
  public id: string;
  public model: Model;
  public name: string;
  public viewpoint: ViewpointType;
  public elements: List<Element>;
  public relationships: List<Relationship>;
  public relationshipTypes: Set<RelationshipType>;
  public pathDepth: number;

  constructor(model: Model) {
    this.id = model.makeUniqueId();
    this.model = model;
    this.name = "New Query";
    this.viewpoint = ViewpointType.Total;
    this.elements = List<Element>();
    this.relationships = List<Relationship>();
    this.relationshipTypes = Set<RelationshipType>(RelationshipTypes);
    this.pathDepth = 3;
  }

  // public availableElementTypes(): Set<ElementType> {

  // }

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
