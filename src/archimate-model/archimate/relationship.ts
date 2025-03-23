import { AccessType } from "./access-type";
import { IEntity, IModel, IRelationship } from "./interfaces";
import { Property } from "./property";
import { RelationshipType } from "./relationship-type";

// A base relationship type that can be extended by concrete ArchiMate types.
//
// Note that RelationshipType is abstract, so one must have derived types of
// this type. this is indicated in xml by having a tag name of "relationship"
// and an attribute of xsi:type="AccessRelationship" where AccessRelationship
// is a derived type from RelationshipType.
export class Relationship implements IRelationship {
  public id: string; //
  public type: RelationshipType;
  public name?: string;
  public documentation?: string;
  public properties: Property[];
  public source: string;
  public target: string;
  public accessType?: AccessType;
  public derived: boolean = false;
  public strength?: string;
  public model: IModel;

  constructor(
    model: IModel,
    type: RelationshipType,
    source: string,
    target: string,
  ) {
    this.model = model;
    this.type = type;
    this.id = model.makeUniqueId();
    this.source = source;
    this.target = target;
    this.properties = [];
  }

  public sourceElement(): IEntity | undefined {
    return this.model.lookup(this.source) as IEntity;
  }

  public targetElement(): IEntity | undefined {
    return this.model.lookup(this.target) as IEntity;
  }
  // weight() {
  //   self.class::WEIGHT
  // }

  // classification() {
  //   self.class::CLASSIFICATION
  // }

  // verb() {
  //   self.class::VERB
  // }

  public toString() {
    return `<${this.id}>[${this.name || ""}] ${this.source} -> ${this.target}`;
  }

  // description() {
  //   [
  //     name.nil? ? nil : "#{name}:",
  //     verb
  //   ].compact.join(" ")
  // }

  // Diagrams that this entity is referenced in.
  public diagrams() {
    return this.model.diagrams.filter((dia) =>
      dia.relationships().find((rel) => rel.id === this.id),
    );
  }

  // replace_item_with(item, replacement) {
  //   super
  //   item.remove_reference(self)
  //   case item
  //   when source
  //     @source = replacement
  //   when target
  //     @target = replacement
  //   else
  //     raise "Trying to replace #{item} that I don't reference"
  //   end
  // }
}
