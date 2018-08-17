import { AccessType } from "../../access-type";
import { DiagramType } from "../../diagram-type";
import { Element as ArchiElement } from "../../element";
import { ElementType } from "../../element-type";
import { IModel, ParserError } from "../../interfaces";
import { Relationship } from "../../relationship";
import { RelationshipType } from "../../relationship-type";
import { DiagramParser } from "./diagram-parser";
import { DocumentationParser } from "./documentation-parser";
import { getStringAttribute } from "./dom-helpers";
import { PropertiesParser } from "./properties-parser";

export class ElementTagParser {
  public model: IModel;
  public doc: XMLDocument;
  private diagramParser: DiagramParser;
  private documentationParser: DocumentationParser;
  private propertiesParser: PropertiesParser;

  constructor(model: IModel, doc: XMLDocument) {
    this.model = model;
    this.doc = doc;
    this.handleElement = this.handleElement.bind(this);
    this.diagramParser = new DiagramParser(model);
    this.documentationParser = new DocumentationParser();
    this.propertiesParser = new PropertiesParser(model);
  }

  public elements() {
    const els = this.doc.querySelectorAll("element");
    if (els === null) {
      return;
    }
    els.forEach(this.handleElement);
  }

  private parseArchimateElement(el: Element, type: ElementType) {
    const archiEl = new ArchiElement(this.model, type);
    archiEl.id = getStringAttribute(el, "id") || "";
    archiEl.name = getStringAttribute(el, "name") || "";
    archiEl.documentation = this.documentationParser.value(el);
    archiEl.properties = this.propertiesParser.properties(el);
    this.model.elements.push(archiEl);
  }

  private parseArchimateRelationship(el: Element, type: RelationshipType) {
    const source = getStringAttribute(el, "source");
    const target = getStringAttribute(el, "target");
    if (source === undefined) {
      throw new ParserError("Expected source to be present");
    }
    if (target === undefined) {
      throw new ParserError("Expected target to be present");
    }
    const relationship = new Relationship(this.model, type, source, target);
    relationship.id = getStringAttribute(el, "id") || "";
    relationship.name = getStringAttribute(el, "name") || "";
    relationship.documentation = this.documentationParser.value(el);
    relationship.properties = this.propertiesParser.properties(el);
    relationship.strength = getStringAttribute(el, "strength");
    relationship.accessType = this.parseAccessType(el);
    this.model.relationships.push(relationship);
  }

  private stringToAccessType(str: string): AccessType {
    switch (str) {
      case "1":
        return AccessType.Read;
      case "2":
        return AccessType.Write;
      case "3":
        return AccessType.ReadWrite;
      default:
        return AccessType.Access;
    }
  }
  private parseAccessType(el: Element): AccessType {
    const accessTypeStr = getStringAttribute(el, "accessType");
    if (accessTypeStr === undefined) {
      return AccessType.Access;
    }

    return this.stringToAccessType(accessTypeStr);
  }

  private parseArchimateDiagram(el: Element, type: DiagramType) {
    this.model.diagrams.push(this.diagramParser.diagram(el, type));
  }

  private handleElement(el: Element) {
    const t = el.attributes.getNamedItemNS(
      "http://www.w3.org/2001/XMLSchema-instance",
      "type"
    );
    if (t === null) {
      throw new Error("Couldn't find element type");
    }
    const typeStr = (t as Attr).value.replace("archimate:", "");
    switch (typeStr) {
      case ElementType.BusinessActor:
        this.parseArchimateElement(el, ElementType.BusinessActor);
        break;
      case ElementType.BusinessCollaboration:
        this.parseArchimateElement(el, ElementType.BusinessCollaboration);
        break;
      case ElementType.BusinessEvent:
        this.parseArchimateElement(el, ElementType.BusinessEvent);
        break;
      case ElementType.BusinessFunction:
        this.parseArchimateElement(el, ElementType.BusinessFunction);
        break;
      case ElementType.BusinessInteraction:
        this.parseArchimateElement(el, ElementType.BusinessInteraction);
        break;
      case ElementType.BusinessInterface:
        this.parseArchimateElement(el, ElementType.BusinessInterface);
        break;
      case ElementType.BusinessObject:
        this.parseArchimateElement(el, ElementType.BusinessObject);
        break;
      case ElementType.BusinessProcess:
        this.parseArchimateElement(el, ElementType.BusinessProcess);
        break;
      case ElementType.BusinessRole:
        this.parseArchimateElement(el, ElementType.BusinessRole);
        break;
      case ElementType.BusinessService:
        this.parseArchimateElement(el, ElementType.BusinessService);
        break;
      case ElementType.Contract:
        this.parseArchimateElement(el, ElementType.Contract);
        break;
      case ElementType.Location:
        this.parseArchimateElement(el, ElementType.Location);
        break;
      case ElementType.Product:
        this.parseArchimateElement(el, ElementType.Product);
        break;
      case ElementType.Representation:
        this.parseArchimateElement(el, ElementType.Representation);
        break;
      case ElementType.ApplicationCollaboration:
        this.parseArchimateElement(el, ElementType.ApplicationCollaboration);
        break;
      case ElementType.ApplicationComponent:
        this.parseArchimateElement(el, ElementType.ApplicationComponent);
        break;
      case ElementType.ApplicationEvent:
        this.parseArchimateElement(el, ElementType.ApplicationEvent);
        break;
      case ElementType.ApplicationFunction:
        this.parseArchimateElement(el, ElementType.ApplicationFunction);
        break;
      case ElementType.ApplicationInteraction:
        this.parseArchimateElement(el, ElementType.ApplicationInteraction);
        break;
      case ElementType.ApplicationInterface:
        this.parseArchimateElement(el, ElementType.ApplicationInterface);
        break;
      case ElementType.ApplicationProcess:
        this.parseArchimateElement(el, ElementType.ApplicationProcess);
        break;
      case ElementType.ApplicationService:
        this.parseArchimateElement(el, ElementType.ApplicationService);
        break;
      case ElementType.DataObject:
        this.parseArchimateElement(el, ElementType.DataObject);
        break;
      case ElementType.Artifact:
        this.parseArchimateElement(el, ElementType.Artifact);
        break;
      case ElementType.CommunicationNetwork:
        this.parseArchimateElement(el, ElementType.CommunicationNetwork);
        break;
      case ElementType.CommunicationPath:
        this.parseArchimateElement(el, ElementType.CommunicationPath);
        break;
      case ElementType.Device:
        this.parseArchimateElement(el, ElementType.Device);
        break;
      case ElementType.InfrastructureFunction:
        this.parseArchimateElement(el, ElementType.InfrastructureFunction);
        break;
      case ElementType.InfrastructureInterface:
        this.parseArchimateElement(el, ElementType.InfrastructureInterface);
        break;
      case ElementType.InfrastructureService:
        this.parseArchimateElement(el, ElementType.InfrastructureService);
        break;
      case ElementType.Network:
        this.parseArchimateElement(el, ElementType.Network);
        break;
      case ElementType.Node:
        this.parseArchimateElement(el, ElementType.Node);
        break;
      case ElementType.Path:
        this.parseArchimateElement(el, ElementType.Path);
        break;
      case ElementType.SystemSoftware:
        this.parseArchimateElement(el, ElementType.SystemSoftware);
        break;
      case ElementType.TechnologyCollaboration:
        this.parseArchimateElement(el, ElementType.TechnologyCollaboration);
        break;
      case ElementType.TechnologyEvent:
        this.parseArchimateElement(el, ElementType.TechnologyEvent);
        break;
      case ElementType.TechnologyFunction:
        this.parseArchimateElement(el, ElementType.TechnologyFunction);
        break;
      case ElementType.TechnologyInteraction:
        this.parseArchimateElement(el, ElementType.TechnologyInteraction);
        break;
      case ElementType.TechnologyInterface:
        this.parseArchimateElement(el, ElementType.TechnologyInterface);
        break;
      case ElementType.TechnologyObject:
        this.parseArchimateElement(el, ElementType.TechnologyObject);
        break;
      case ElementType.TechnologyProcess:
        this.parseArchimateElement(el, ElementType.TechnologyProcess);
        break;
      case ElementType.TechnologyService:
        this.parseArchimateElement(el, ElementType.TechnologyService);
        break;
      case ElementType.DistributionNetwork:
        this.parseArchimateElement(el, ElementType.DistributionNetwork);
        break;
      case ElementType.Equipment:
        this.parseArchimateElement(el, ElementType.Equipment);
        break;
      case ElementType.Facility:
        this.parseArchimateElement(el, ElementType.Facility);
        break;
      case ElementType.Material:
        this.parseArchimateElement(el, ElementType.Material);
        break;
      case ElementType.Assessment:
        this.parseArchimateElement(el, ElementType.Assessment);
        break;
      case ElementType.Constraint:
        this.parseArchimateElement(el, ElementType.Constraint);
        break;
      case ElementType.Driver:
        this.parseArchimateElement(el, ElementType.Driver);
        break;
      case ElementType.Goal:
        this.parseArchimateElement(el, ElementType.Goal);
        break;
      case ElementType.Meaning:
        this.parseArchimateElement(el, ElementType.Meaning);
        break;
      case ElementType.Outcome:
        this.parseArchimateElement(el, ElementType.Outcome);
        break;
      case ElementType.Principle:
        this.parseArchimateElement(el, ElementType.Principle);
        break;
      case ElementType.Requirement:
        this.parseArchimateElement(el, ElementType.Requirement);
        break;
      case ElementType.Stakeholder:
        this.parseArchimateElement(el, ElementType.Stakeholder);
        break;
      case ElementType.Value:
        this.parseArchimateElement(el, ElementType.Value);
        break;
      case ElementType.Deliverable:
        this.parseArchimateElement(el, ElementType.Deliverable);
        break;
      case ElementType.Gap:
        this.parseArchimateElement(el, ElementType.Gap);
        break;
      case ElementType.ImplementationEvent:
        this.parseArchimateElement(el, ElementType.ImplementationEvent);
        break;
      case ElementType.Plateau:
        this.parseArchimateElement(el, ElementType.Plateau);
        break;
      case ElementType.WorkPackage:
        this.parseArchimateElement(el, ElementType.WorkPackage);
        break;
      case ElementType.AndJunction:
      case ElementType.Junction:
      case ElementType.OrJunction:
        const jTypeAttr = el.attributes.getNamedItem("type");
        if (jTypeAttr && jTypeAttr.value === "or") {
          this.parseArchimateElement(el, ElementType.OrJunction);
        } else {
          this.parseArchimateElement(el, ElementType.Junction);
        }
        break;
      case ElementType.Capability:
        this.parseArchimateElement(el, ElementType.Capability);
        break;
      case ElementType.CourseOfAction:
        this.parseArchimateElement(el, ElementType.CourseOfAction);
        break;
      case ElementType.Resource:
        this.parseArchimateElement(el, ElementType.Resource);
        break;
      case ElementType.Grouping:
        this.parseArchimateElement(el, ElementType.Grouping);
        break;
      case RelationshipType.Composition:
        this.parseArchimateRelationship(el, RelationshipType.Composition);
        break;
      case RelationshipType.Aggregation:
        this.parseArchimateRelationship(el, RelationshipType.Aggregation);
        break;
      case RelationshipType.Assignment:
        this.parseArchimateRelationship(el, RelationshipType.Assignment);
        break;
      case RelationshipType.Realization:
      case RelationshipType.Realisation:
        this.parseArchimateRelationship(el, RelationshipType.Realization);
        break;
      case RelationshipType.Serving:
      case RelationshipType.UsedBy:
        this.parseArchimateRelationship(el, RelationshipType.Serving);
        break;
      case RelationshipType.Access:
        this.parseArchimateRelationship(el, RelationshipType.Access);
        break;
      case RelationshipType.Influence:
        this.parseArchimateRelationship(el, RelationshipType.Influence);
        break;
      case RelationshipType.Triggering:
        this.parseArchimateRelationship(el, RelationshipType.Triggering);
        break;
      case RelationshipType.Flow:
        this.parseArchimateRelationship(el, RelationshipType.Flow);
        break;
      case RelationshipType.Specialization:
      case RelationshipType.Specialisation:
        this.parseArchimateRelationship(el, RelationshipType.Specialization);
        break;
      case RelationshipType.Association:
        this.parseArchimateRelationship(el, RelationshipType.Association);
        break;
      case RelationshipType.Junction:
        this.parseArchimateRelationship(el, RelationshipType.Junction);
        break;
      case RelationshipType.AndJunction:
        this.parseArchimateRelationship(el, RelationshipType.AndJunction);
        break;
      case RelationshipType.OrJunction:
        this.parseArchimateRelationship(el, RelationshipType.OrJunction);
        break;
      case DiagramType.ArchimateDiagramModel:
        this.parseArchimateDiagram(el, DiagramType.ArchimateDiagramModel);
        break;
      case DiagramType.SketchModel:
        this.parseArchimateDiagram(el, DiagramType.SketchModel);
        break;
      default:
        throw new Error(`Unexpected Element Type ${typeStr}`);
    }
  }
}
