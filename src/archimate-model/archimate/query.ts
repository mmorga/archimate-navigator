import { List } from "immutable";
import { Element } from "./element";
import { Model } from "./model";
import { Relationship } from "./relationship";
import { ViewpointType } from "./viewpoint-type";

export interface IQuery {
  id: string;
  model: Model;
  name: string;
  viewpoint: ViewpointType;
  elements: List<Element>;
  relationships: List<Relationship>;
  pathDepth: number;
}

export class Query implements IQuery {
  public id: string;
  public model: Model;
  public name: string;
  public viewpoint: ViewpointType;
  public elements: List<Element>;
  public relationships: List<Relationship>;
  public pathDepth: number;

  constructor(model: Model) {
    this.id = model.makeUniqueId();
    this.model = model;
    this.name = "New Query";
    this.viewpoint = ViewpointType.Total;
    this.elements = List<Element>();
    this.relationships = List<Relationship>();
    this.pathDepth = 3;
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
