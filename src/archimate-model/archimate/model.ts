import { Diagram } from "./diagram";
import { Element } from "./element";
import {
  IEntity,
  IHasOrganizations,
  IIdentifiable,
  IModel
} from "./interfaces";
import { Organization } from "./organization";
import { Property } from "./property";
import { Relationship } from "./relationship";

function emptyIndexHash() {
  return new Map<string, IEntity>();
}

// This is the root model type.
// It is a container for the elements, relationships, diagrams and
// organizations of the model.
class Model implements IModel {
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
  public diagrams: Diagram[] = []; // Diagram[] = [];
  public viewpoints: IIdentifiable[] = [];
  public href?: string | undefined;
  public type: string;

  private indexHash: Map<string, IEntity>;

  // Constructor TODO: parse opts
  constructor() {
    this.indexHash = emptyIndexHash();
    this.properties = [];
    this.rebuildIndex();
    this.type = "Model";
  }

  public lookup(id: string | undefined) {
    if (id === undefined) {
      return undefined;
    }
    if (this.indexHash.get(id) === undefined) {
      this.rebuildIndex(id);
    }
    return this.indexHash.get(id);
  }

  // Called only by [Lint::DuplicateEntities]
  public entities(): IEntity[] {
    return Array.from(this.indexHash.values());
  }

  public toString() {
    return `Model<${this.id}>[${this.name}]`;
  }

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

  // remove_reference(item) {
  //   case item
  //   when Element
  //     elements.delete(item)
  //   when Relationship
  //     relationships.delete(item)
  //   when Diagram
  //     diagrams.delete(item)
  //   else
  //     raise "Unhandled remove reference for type #{item.class}"
  //   }
  //   organizations.each { |org| org.remove_reference(item) }
  // }

  // Elements.classes.each do |el_cls|
  //   define_method(el_cls.name.split("::").last.snake_case + "s") do
  //     elements.select { |el| el.is_a?(el_cls) }
  //   }
  // }

  private rebuildIndex(missingId?: string) {
    if (missingId === undefined) {
      return this;
    }
    this.indexHash = this.buildIndex();
    return this;
  }

  // Only used by [#find_default_organization]
  // add_organization(type, name)
  //   raise "Program Error: #{organizations.inspect}" unless
  //           organizations.none? { |f| f.type == type || f.name == name }
  //   organization = Organization.new(
  //     id: make_unique_id,
  //     name: LangString.new(name),
  //     type: type,
  //     items: [],
  //     organizations: [],
  //     documentation: nil
  //   )
  //   register(organization, organizations)
  //   organizations.push(organization)
  //   organization
  // }

  private buildIndex() {
    this.indexHash = emptyIndexHash();
    this.indexHash.set(this.id, this);
    this.elements.forEach((ref: IEntity) => {
      this.indexHash.set(ref.id, ref);
    });
    this.relationships.forEach(ref => {
      this.indexHash.set(ref.id, ref);
    });
    this.diagrams.forEach(dia => {
      this.indexHash.set(dia.id, this.indexViewNodes(dia));
    });
    // this.propertyDefs.forEach((ref) => { this.indexHash.set(ref.id, ref); });
    this.indexOrganizations(this);
    return this.indexHash;
  }

  // @todo maybe move to [ViewNode]
  private indexViewNodes(ref: Diagram): Diagram {
    ref.nodes.forEach(node => this.indexHash.set(node.id, node));
    ref.connections.forEach(con => this.indexHash.set(con.id, con));
    return ref;
  }

  // default_organization_for(item)
  //   case item
  //   when Element
  //     case item.layer
  //     when Layers::Strategy
  //       find_default_organization("strategy", "Strategy")
  //     when Layers::Business
  //       find_default_organization("business", "Business")
  //     when Layers::Application
  //       find_default_organization("application", "Application")
  //     when Layers::Technology
  //       find_default_organization("technology", "Technology")
  //     when Layers::Physical
  //       find_default_organization("physical", "Physical")
  //     when Layers::Motivation
  //       find_default_organization("motivation", "Motivation")
  //     when Layers::Implementation_and_migration
  //       find_default_organization("implementation_migration", "Implementation & Migration")
  //     when Layers::Connectors
  //       find_default_organization("connectors", "Connectors")
  //     when Layers::Other
  //       find_default_organization("other", "Other")
  //     else
  //       raise StandardError, "Unexpected Element Layer: #{item.layer} for item type #{item.type}"
  //     }
  //   when Relationship
  //     find_default_organization("relations", "Relations")
  //   when Diagram
  //     find_default_organization("diagrams", "Views")
  //   else
  //     raise StandardError, "Unexpected item type #{item.class}"
  //   }
  // }

  // find_by_class(klass)
  //   this.indexHash.values.select { |item| item.is_a?(klass) }
  // }

  // find_default_organization(type, name)
  //   result = organizations.find { |f| f.type == type }
  //   return result unless result.nil?
  //   result = organizations.find { |f| f.name == name }
  //   return result unless result.nil?
  //   add_organization(type, name)
  // }

  // find_in_organizations(item, _fs = nil)
  //   find_by_class(DataModel::Organization).select { |f| f.items.include?(item) }.first
  // }

  private registerOrg(org: Organization) {
    this.indexOrganizations(org);
    this.indexHash.set(org.id, org);
  }

  // @todo maybe move to [Organization]
  private indexOrganizations(ref: IHasOrganizations) {
    const regFunc = this.registerOrg.bind(this);
    ref.organizations.forEach(regFunc);
    // ref.organizations.forEach(org => {
    //   (this as Model).indexHash[org.id] = this.indexOrganizations(org)
    // });
    return ref;
  }
}

export { Model };
