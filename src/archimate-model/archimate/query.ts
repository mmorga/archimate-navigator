import { Set } from "immutable";
import { Element } from "./element";
import { ElementType, ElementTypes } from "./element-type";
import { Model } from "./model";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { ViewpointType } from "./viewpoint-type";

interface IQueryUpdateProps {
  elements?: Set<Element>;
  elementTypes?: Set<ElementType>;
  id?: string;
  includeDerivedRelations?: boolean;
  model?: Model;
  name?: string;
  pathDepth?: number;
  relationships?: Set<Relationship>;
  relationshipTypes?: Set<RelationshipType>;
  viewpoint?: ViewpointType;
}

export class Query {
  public elements: Set<Element>;
  public elementTypes: Set<ElementType>;
  public id: string;
  public includeDerivedRelations: boolean;
  public model: Model;
  public name: string;
  public pathDepth: number;
  public relationships: Set<Relationship>;
  public relationshipTypes: Set<RelationshipType>;
  public viewpoint: ViewpointType;

  constructor(model: Model) {
    this.elements = Set<Element>();
    this.elementTypes = Set<ElementType>(ElementTypes);
    this.id = model.makeUniqueId();
    this.includeDerivedRelations = false;
    this.model = model;
    this.name = "New Query";
    this.pathDepth = 3;
    this.relationships = Set<Relationship>();
    this.relationshipTypes = Set<RelationshipType>(RelationshipTypes);
    this.viewpoint = ViewpointType.Total;
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
