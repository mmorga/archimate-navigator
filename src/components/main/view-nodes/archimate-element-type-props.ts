import { ViewNode, zeroBounds } from "../../../archimate-model";
import { defaultTextBounds as defaultTextBounds } from "./base-shape";
import ApplicationComponentShape, {
  applicationComponentTextBounds,
  enterApplicationComponentShape,
} from "./application-component-shape";
import ArtifactShape, { enterArtifactShape } from "./artifact-shape";
import BadgedNodeShape, {
  badgedNodeBadgeBounds,
  badgedNodeTextBounds,
  enterBadgedNodeShape,
} from "./badged-node-shape";
import BadgedRectShape, {
  badgedRectBadgeBounds,
  enterBadgedRectShape,
} from "./badged-rect-shape";
import BadgedRoundedRectShape, {
  enterBadgedRoundedRectShape,
} from "./badged-rounded-rect-shape";
import ContractShape, { enterContractShape } from "./contract-shape";
import DataObjectShape, {
  dataObjectTextBounds,
  enterDataObjectShape,
} from "./data-object-shape";
import DeliverableShape, { enterDeliverableShape } from "./deliverable-shape";
import DeviceShape, { enterDeviceShape } from "./device-shape";
import EventShape, {
  enterEventShape,
  eventBadgeBounds,
  eventTextBounds,
} from "./event-shape";
import GroupingShape, { enterGroupingShape } from "./grouping-shape";
import GroupShape, { enterGroupShape, groupTextBounds } from "./group-shape";
import InterfaceShape, { enterInterfaceShape } from "./interface-shape";
import JunctionShape, { enterJunctionShape } from "./junction-shape";
import MeaningShape, { enterMeaningShape } from "./meaning-shape";
import MotivationShape, { enterMotivationShape } from "./motivation-shape";
import NodeShape, { enterNodeShape, nodeTextBounds } from "./node-shape";
import NoteShape, { enterNoteShape } from "./note-shape";
import ProcessShape, {
  enterProcessShape,
  processTextBounds,
} from "./process-shape";
import ProductShape, { enterProductShape } from "./product-shape";
import RepresentationShape, {
  enterRepresentationShape,
} from "./representation-shape";
import ServiceShape, {
  enterServiceShape,
  serviceTextBounds,
} from "./service-shape";
import ValueShape, { enterValueShape, valueTextBounds } from "./value-shape";

export default function archimateElementTypeProps(vn: ViewNode): void {
  switch (vn.elementType()) {
    case "AndJunction":
    case "Junction":
      vn.backgroundClass = "archimate-junction-background";
      vn.EntityShape = JunctionShape;
      vn.enterEntityShapeFunc = enterJunctionShape;
      break;
    case "OrJunction":
      vn.backgroundClass = "archimate-or-junction-background";
      vn.EntityShape = JunctionShape;
      vn.enterEntityShapeFunc = enterJunctionShape;
      break;
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      vn.badge = "#archimate-collaboration-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "ApplicationComponent":
      vn.badge =
        vn.childType === "1" ? "#archimate-app-component-badge" : undefined;
      vn.badgeBounds =
        vn.childType === "1" ? badgedRectBadgeBounds : zeroBounds;
      vn.textBounds = applicationComponentTextBounds;
      vn.EntityShape = ApplicationComponentShape;
      vn.enterEntityShapeFunc = enterApplicationComponentShape;
      break;
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      vn.EntityShape = EventShape;
      vn.enterEntityShapeFunc = enterEventShape;
      vn.badge = vn.childType === "1" ? undefined : "#archimate-event-badge";
      vn.badgeBounds = eventBadgeBounds;
      vn.textBounds = eventTextBounds;
      break;
    case "ApplicationFunction":
    case "BusinessFunction":
    case "TechnologyFunction":
      vn.badge = "#archimate-function-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRoundedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRoundedRectShape;
      break;
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      vn.badge = "#archimate-interaction-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRoundedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRoundedRectShape;
      break;
    case "ApplicationInterface":
    case "BusinessInterface":
    case "TechnologyInterface":
      vn.badge =
        vn.childType === "1" ? undefined : "#archimate-interface-badge";
      vn.badgeBounds =
        vn.childType === "1" ? zeroBounds : badgedRectBadgeBounds;
      vn.EntityShape = InterfaceShape;
      vn.enterEntityShapeFunc = enterInterfaceShape;
      break;
    case "ApplicationProcess":
    case "BusinessProcess":
    case "TechnologyProcess":
      vn.badge = vn.childType === "1" ? undefined : "#archimate-process-badge";
      vn.badgeBounds =
        vn.childType === "1" ? zeroBounds : badgedRectBadgeBounds;
      vn.textBounds =
        vn.childType === "1" ? processTextBounds : defaultTextBounds;
      vn.EntityShape = ProcessShape;
      vn.enterEntityShapeFunc = enterProcessShape;
      break;
    case "ApplicationService":
    case "BusinessService":
    case "TechnologyService":
      vn.badge = vn.childType === "1" ? undefined : "#archimate-service-badge";
      vn.badgeBounds =
        vn.childType === "1" ? zeroBounds : badgedRectBadgeBounds;
      vn.textBounds =
        vn.childType === "1" ? serviceTextBounds : defaultTextBounds;
      vn.EntityShape = ServiceShape;
      vn.enterEntityShapeFunc = enterServiceShape;
      break;
    case "BusinessActor":
      vn.badge = "#archimate-actor-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Artifact":
      vn.badge = "archimate-artifact-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = ArtifactShape;
      vn.enterEntityShapeFunc = enterArtifactShape;
      break;
    case "Assessment":
      vn.badge = "#archimate-assessment-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Driver":
      vn.badge = "#archimate-driver-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Constraint":
      vn.badge = "#archimate-constraint-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Goal":
      vn.badge = "#archimate-goal-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Outcome":
      vn.badge = "#archimate-outcome-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Principle":
      vn.badge = "#archimate-principle-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Requirement":
      vn.badge = "#archimate-requirement-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "Stakeholder":
      vn.badge = "#archimate-stakeholder-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      vn.enterEntityShapeFunc = enterMotivationShape;
      break;
    case "BusinessObject":
    case "DataObject":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = DataObjectShape;
      vn.enterEntityShapeFunc = enterDataObjectShape;
      break;
    case "BusinessRole":
      vn.badge = "#archimate-role-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Contract":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = ContractShape;
      vn.enterEntityShapeFunc = enterContractShape;
      break;
    case "Deliverable":
      vn.badge = "archimate-artifact-badge";
      vn.EntityShape = DeliverableShape;
      vn.enterEntityShapeFunc = enterDeliverableShape;
      break;
    case "Gap":
      vn.backgroundClass = "archimate-implementation2-background";
      vn.badge = "#archimate-gap-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = DeliverableShape;
      vn.enterEntityShapeFunc = enterDeliverableShape;
      break;
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      vn.backgroundClass = "archimate-diagram-model-reference-background";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Device":
      vn.badge = vn.childType === "1" ? "#archimate-device-badge" : undefined;
      vn.badgeBounds =
        vn.childType === "1" ? badgedNodeBadgeBounds : zeroBounds;
      vn.textBounds = vn.childType === "1" ? nodeTextBounds : defaultTextBounds;
      vn.EntityShape = DeviceShape;
      vn.enterEntityShapeFunc = enterDeviceShape;
      break;
    case "Plateau":
      vn.backgroundClass = "archimate-implementation2-background";
      vn.badge = "#archimate-plateau-badge";
      vn.EntityShape = BadgedNodeShape;
      vn.enterEntityShapeFunc = enterBadgedNodeShape;
      vn.badgeBounds = badgedNodeBadgeBounds;
      vn.textBounds = nodeTextBounds;
      break;
    case "Node":
      vn.badge = vn.childType === "1" ? "#archimate-node-badge" : undefined;
      vn.badgeBounds =
        vn.childType === "1" ? badgedRectBadgeBounds : zeroBounds;
      vn.textBounds =
        vn.childType === "1" ? badgedNodeTextBounds : nodeTextBounds;
      vn.EntityShape = NodeShape;
      vn.enterEntityShapeFunc = enterNodeShape;
      break;
    case "DistributionNetwork":
      vn.badge = "#archimate-distribution-network-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Group":
      vn.backgroundClass = "archimate-group-background";
      vn.textAlign = "left";
      vn.textBounds = groupTextBounds;
      vn.EntityShape = GroupShape;
      vn.enterEntityShapeFunc = enterGroupShape;
      break;
    case "Grouping":
      vn.backgroundClass = "archimate-grouping-background";
      vn.textAlign = "left";
      vn.textBounds = groupTextBounds;
      vn.EntityShape = GroupingShape;
      vn.enterEntityShapeFunc = enterGroupingShape;
      break;
    case "Location":
      vn.backgroundClass = "archimate-location-background";
      vn.badge = "#archimate-location-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Meaning":
      vn.EntityShape = MeaningShape;
      vn.enterEntityShapeFunc = enterMeaningShape;
      break;
    case "CommunicationNetwork":
    case "Network":
      vn.badge = "#archimate-network-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Path":
      vn.badge = "#archimate-communication-path-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "Resource":
      vn.badge = "#archimate-resource-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "SystemSoftware":
      vn.badge = "#archimate-system-software-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRectShape;
      break;
    case "DiagramObject":
    case "Note":
      vn.backgroundClass = "archimate-note-background";
      vn.textAlign = "left";
      vn.EntityShape = NoteShape;
      vn.enterEntityShapeFunc = enterNoteShape;
      break;
    case "Product":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = ProductShape;
      vn.enterEntityShapeFunc = enterProductShape;
      break;
    case "Representation":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = RepresentationShape;
      vn.enterEntityShapeFunc = enterRepresentationShape;
      break;
    case "SketchModelSticky":
      vn.backgroundClass = "archimate-sticky-background";
      break;
    case "Value":
      vn.textBounds = valueTextBounds;
      vn.backgroundClass = "archimate-motivation-background";
      vn.EntityShape = ValueShape;
      vn.enterEntityShapeFunc = enterValueShape;
      break;
    case "WorkPackage":
      vn.EntityShape = BadgedRoundedRectShape;
      vn.enterEntityShapeFunc = enterBadgedRoundedRectShape;
      break;
  }
}
