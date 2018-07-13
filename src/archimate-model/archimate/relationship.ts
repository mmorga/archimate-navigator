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
  public name?: string; // default: nil
  public documentation?: string; // writable: true, default: nil
  public properties: Property[]; // default: []
  public source?: string; // comparison_attr: :id, writable: true, default: nil
  public target?: string; // comparison_attr: :id, writable: true, default: nil
  public accessType?: AccessType; // default: nil
  public derived: boolean = false;
  public model: IModel;

  constructor(model: IModel, type: RelationshipType) {
    this.model = model;
    this.type = type;
    this.id = model.makeUniqueId();
    this.properties = [];
  }

  public sourceElement(): IEntity | undefined {
    return this.model.lookup(this.source) as IEntity;
  }

  public targetElement(): IEntity | undefined {
    return this.model.lookup(this.target) as IEntity;
  }
  // replace(entity, with_entity) {
  //   @source = with_entity.id if source == entity.id
  //   @target = with_entity.id if target == entity.id
  // }

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

  // Copy any attributes/docs, etc. from each of the others into the original.
  //     1. Child `label`s with different `xml:lang` attribute values
  //     2. Child `documentation` (and different `xml:lang` attribute values)
  //     3. Child `properties`
  //     4. Any other elements
  // source and target don't change on a merge
  // merge(relationship) {
  //   if !documentation
  //     self.documentation = relationship.documentation
  //   elsif documentation != relationship.documentation
  //     documentation.merge(relationship.documentation)
  //   end
  //   relationship.properties.each do |property|
  //     unless properties.find { |my_prop|
  //         my_prop.property_definition.name == property.property_definition.name && my_prop.value == property.value
  //     }
  //       properties << property
  //     end
  //   end
  //   @access_type ||= relationship.access_type
  // }

  // Diagrams that this entity is referenced in.
  public diagrams() {
    // references.select { |ref| ref.is_a?(Diagram) }
    return this.model.diagrams;
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
