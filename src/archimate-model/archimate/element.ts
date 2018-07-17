import { ElementType } from "./element-type";
import {
  IDiagram,
  IEntity,
  IHasRelationships,
  IModel,
  IProperty,
  IRelationship
} from "./interfaces";

// A base element type that can be extended by concrete ArchiMate types.
//
// Note that ElementType is abstract, so one must have derived types of this
// type. This is indicated in xml by having a tag name of +element+ and an
// attribute of +xsi:type="BusinessRole"+ where +BusinessRole+ is a derived
// type from [ElementType].
export class Element implements IEntity, IHasRelationships {
  public id: string;
  public type: ElementType;
  public name: string;
  public documentation?: string;
  public properties: IProperty[];
  public href?: string;
  private model: IModel;
  private diagramCache?: IDiagram[];

  constructor(model: IModel, type: ElementType, id?: string, name?: string) {
    this.model = model;
    this.type = type;
    this.id = id || model.makeUniqueId();
    this.name = name || "";
    this.properties = [];
  }

  // TODO: Implement me
  public relationships(): IRelationship[] {
    return [];
  }

  public toString() {
    return `${this.type}<${this.id}>[${this.name}]`;
  }

  // classification() {
  //   this.class::CLASSIFICATION
  // }

  // layer() {
  //   this.class::LAYER
  // }

  // Diagrams that this entity is referenced in.
  // TODO: memoize the response
  public diagrams() {
    if (this.diagramCache) {
      return this.diagramCache;
    }
    this.diagramCache = this.model.diagrams.filter(dia => dia.elements().find(el => el === this));
    return this.diagramCache;
  }
}
