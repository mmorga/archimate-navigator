import { DiagramType } from "../../diagram-type";
import { Element as ArchiElement } from "../../element";
import { ElementType } from "../../element-type";
import { IModel } from "../../interfaces";
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
    const archiEl = new Relationship(this.model, type);
    archiEl.id = getStringAttribute(el, "id") || "";
    archiEl.name = getStringAttribute(el, "name") || "";
    archiEl.documentation = this.documentationParser.value(el);
    archiEl.properties = this.propertiesParser.properties(el);
    this.model.relationships.push(archiEl);
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
      case ElementType.BusinessActorElementType:
        this.parseArchimateElement(el, ElementType.BusinessActorElementType);
        break;
      case ElementType.BusinessCollaborationElementType:
        this.parseArchimateElement(
          el,
          ElementType.BusinessCollaborationElementType
        );
        break;
      case ElementType.BusinessEventElementType:
        this.parseArchimateElement(el, ElementType.BusinessEventElementType);
        break;
      case ElementType.BusinessFunctionElementType:
        this.parseArchimateElement(el, ElementType.BusinessFunctionElementType);
        break;
      case ElementType.BusinessInteractionElementType:
        this.parseArchimateElement(
          el,
          ElementType.BusinessInteractionElementType
        );
        break;
      case ElementType.BusinessInterfaceElementType:
        this.parseArchimateElement(
          el,
          ElementType.BusinessInterfaceElementType
        );
        break;
      case ElementType.BusinessObjectElementType:
        this.parseArchimateElement(el, ElementType.BusinessObjectElementType);
        break;
      case ElementType.BusinessProcessElementType:
        this.parseArchimateElement(el, ElementType.BusinessProcessElementType);
        break;
      case ElementType.BusinessRoleElementType:
        this.parseArchimateElement(el, ElementType.BusinessRoleElementType);
        break;
      case ElementType.BusinessServiceElementType:
        this.parseArchimateElement(el, ElementType.BusinessServiceElementType);
        break;
      case ElementType.ContractElementType:
        this.parseArchimateElement(el, ElementType.ContractElementType);
        break;
      case ElementType.LocationElementType:
        this.parseArchimateElement(el, ElementType.LocationElementType);
        break;
      case ElementType.ProductElementType:
        this.parseArchimateElement(el, ElementType.ProductElementType);
        break;
      case ElementType.RepresentationElementType:
        this.parseArchimateElement(el, ElementType.RepresentationElementType);
        break;
      case ElementType.ApplicationCollaborationElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationCollaborationElementType
        );
        break;
      case ElementType.ApplicationComponentElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationComponentElementType
        );
        break;
      case ElementType.ApplicationEventElementType:
        this.parseArchimateElement(el, ElementType.ApplicationEventElementType);
        break;
      case ElementType.ApplicationFunctionElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationFunctionElementType
        );
        break;
      case ElementType.ApplicationInteractionElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationInteractionElementType
        );
        break;
      case ElementType.ApplicationInterfaceElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationInterfaceElementType
        );
        break;
      case ElementType.ApplicationProcessElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationProcessElementType
        );
        break;
      case ElementType.ApplicationServiceElementType:
        this.parseArchimateElement(
          el,
          ElementType.ApplicationServiceElementType
        );
        break;
      case ElementType.DataObjectElementType:
        this.parseArchimateElement(el, ElementType.DataObjectElementType);
        break;
      case ElementType.ArtifactElementType:
        this.parseArchimateElement(el, ElementType.ArtifactElementType);
        break;
      case ElementType.CommunicationNetworkElementType:
        this.parseArchimateElement(
          el,
          ElementType.CommunicationNetworkElementType
        );
        break;
      case ElementType.CommunicationPathElementType:
        this.parseArchimateElement(
          el,
          ElementType.CommunicationPathElementType
        );
        break;
      case ElementType.DeviceElementType:
        this.parseArchimateElement(el, ElementType.DeviceElementType);
        break;
      case ElementType.InfrastructureFunctionElementType:
        this.parseArchimateElement(
          el,
          ElementType.InfrastructureFunctionElementType
        );
        break;
      case ElementType.InfrastructureInterfaceElementType:
        this.parseArchimateElement(
          el,
          ElementType.InfrastructureInterfaceElementType
        );
        break;
      case ElementType.InfrastructureServiceElementType:
        this.parseArchimateElement(
          el,
          ElementType.InfrastructureServiceElementType
        );
        break;
      case ElementType.NetworkElementType:
        this.parseArchimateElement(el, ElementType.NetworkElementType);
        break;
      case ElementType.NodeElementType:
        this.parseArchimateElement(el, ElementType.NodeElementType);
        break;
      case ElementType.PathElementType:
        this.parseArchimateElement(el, ElementType.PathElementType);
        break;
      case ElementType.SystemSoftwareElementType:
        this.parseArchimateElement(el, ElementType.SystemSoftwareElementType);
        break;
      case ElementType.TechnologyCollaborationElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyCollaborationElementType
        );
        break;
      case ElementType.TechnologyEventElementType:
        this.parseArchimateElement(el, ElementType.TechnologyEventElementType);
        break;
      case ElementType.TechnologyFunctionElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyFunctionElementType
        );
        break;
      case ElementType.TechnologyInteractionElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyInteractionElementType
        );
        break;
      case ElementType.TechnologyInterfaceElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyInterfaceElementType
        );
        break;
      case ElementType.TechnologyObjectElementType:
        this.parseArchimateElement(el, ElementType.TechnologyObjectElementType);
        break;
      case ElementType.TechnologyProcessElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyProcessElementType
        );
        break;
      case ElementType.TechnologyServiceElementType:
        this.parseArchimateElement(
          el,
          ElementType.TechnologyServiceElementType
        );
        break;
      case ElementType.DistributionNetworkElementType:
        this.parseArchimateElement(
          el,
          ElementType.DistributionNetworkElementType
        );
        break;
      case ElementType.EquipmentElementType:
        this.parseArchimateElement(el, ElementType.EquipmentElementType);
        break;
      case ElementType.FacilityElementType:
        this.parseArchimateElement(el, ElementType.FacilityElementType);
        break;
      case ElementType.MaterialElementType:
        this.parseArchimateElement(el, ElementType.MaterialElementType);
        break;
      case ElementType.AssessmentElementType:
        this.parseArchimateElement(el, ElementType.AssessmentElementType);
        break;
      case ElementType.ConstraintElementType:
        this.parseArchimateElement(el, ElementType.ConstraintElementType);
        break;
      case ElementType.DriverElementType:
        this.parseArchimateElement(el, ElementType.DriverElementType);
        break;
      case ElementType.GoalElementType:
        this.parseArchimateElement(el, ElementType.GoalElementType);
        break;
      case ElementType.MeaningElementType:
        this.parseArchimateElement(el, ElementType.MeaningElementType);
        break;
      case ElementType.OutcomeElementType:
        this.parseArchimateElement(el, ElementType.OutcomeElementType);
        break;
      case ElementType.PrincipleElementType:
        this.parseArchimateElement(el, ElementType.PrincipleElementType);
        break;
      case ElementType.RequirementElementType:
        this.parseArchimateElement(el, ElementType.RequirementElementType);
        break;
      case ElementType.StakeholderElementType:
        this.parseArchimateElement(el, ElementType.StakeholderElementType);
        break;
      case ElementType.ValueElementType:
        this.parseArchimateElement(el, ElementType.ValueElementType);
        break;
      case ElementType.DeliverableElementType:
        this.parseArchimateElement(el, ElementType.DeliverableElementType);
        break;
      case ElementType.GapElementType:
        this.parseArchimateElement(el, ElementType.GapElementType);
        break;
      case ElementType.ImplementationEventElementType:
        this.parseArchimateElement(
          el,
          ElementType.ImplementationEventElementType
        );
        break;
      case ElementType.PlateauElementType:
        this.parseArchimateElement(el, ElementType.PlateauElementType);
        break;
      case ElementType.WorkPackageElementType:
        this.parseArchimateElement(el, ElementType.WorkPackageElementType);
        break;
      case ElementType.AndJunctionElementType:
        this.parseArchimateElement(el, ElementType.AndJunctionElementType);
        break;
      case ElementType.JunctionElementType:
        this.parseArchimateElement(el, ElementType.JunctionElementType);
        break;
      case ElementType.OrJunctionElementType:
        this.parseArchimateElement(el, ElementType.OrJunctionElementType);
        break;
      case ElementType.CapabilityElementType:
        this.parseArchimateElement(el, ElementType.CapabilityElementType);
        break;
      case ElementType.CourseOfActionElementType:
        this.parseArchimateElement(el, ElementType.CourseOfActionElementType);
        break;
      case ElementType.ResourceElementType:
        this.parseArchimateElement(el, ElementType.ResourceElementType);
        break;
      case ElementType.GroupingElementType:
        this.parseArchimateElement(el, ElementType.GroupingElementType);
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
        this.parseArchimateRelationship(el, RelationshipType.Realization);
        break;
      case RelationshipType.Serving:
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
