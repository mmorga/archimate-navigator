import { ViewNode, zeroBounds } from "../../../archimate-model";
import { defaultTextBounds as defaultTextBounds } from "./base-shape";
import ApplicationComponentShape, {
  applicationComponentTextBounds,
} from "./application-component-shape";
import ArtifactShape from "./artifact-shape";
import BadgedNodeShape, {
  badgedNodeBadgeBounds,
  badgedNodeTextBounds,
} from "./badged-node-shape";
import BadgedRectShape, { badgedRectBadgeBounds } from "./badged-rect-shape";
import BadgedRoundedRectShape from "./badged-rounded-rect-shape";
import ContractShape from "./contract-shape";
import DataObjectShape, { dataObjectTextBounds } from "./data-object-shape";
import DeliverableShape from "./deliverable-shape";
import DeviceShape from "./device-shape";
import EventShape, { eventBadgeBounds, eventTextBounds } from "./event-shape";
import GroupingShape from "./grouping-shape";
import GroupShape, { groupTextBounds } from "./group-shape";
import InterfaceShape from "./interface-shape";
import JunctionShape from "./junction-shape";
import MeaningShape from "./meaning-shape";
import MotivationShape from "./motivation-shape";
import NodeShape, { nodeTextBounds } from "./node-shape";
import NoteShape from "./note-shape";
import ProcessShape, { processTextBounds } from "./process-shape";
import ProductShape from "./product-shape";
import RepresentationShape from "./representation-shape";
import ServiceShape, { serviceTextBounds } from "./service-shape";
import ValueShape, { valueTextBounds } from "./value-shape";

export default function archimateElementTypeProps(vn: ViewNode): void {
  switch (vn.elementType()) {
    case "AndJunction":
    case "Junction":
      vn.backgroundClass = "archimate-junction-background";
      vn.EntityShape = JunctionShape;
      break;
    case "OrJunction":
      vn.backgroundClass = "archimate-or-junction-background";
      vn.EntityShape = JunctionShape;
      break;
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      vn.badge = "#archimate-collaboration-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "ApplicationComponent":
      vn.badge =
        vn.childType === "1" ? "#archimate-app-component-badge" : undefined;
      vn.badgeBounds =
        vn.childType === "1" ? badgedRectBadgeBounds : zeroBounds;
      vn.textBounds = applicationComponentTextBounds;
      vn.EntityShape = ApplicationComponentShape;
      break;
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      vn.EntityShape = EventShape;
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
      break;
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      vn.badge = "#archimate-interaction-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRoundedRectShape;
      break;
    case "ApplicationInterface":
    case "BusinessInterface":
    case "TechnologyInterface":
      vn.badge =
        vn.childType === "1" ? undefined : "#archimate-interface-badge";
      vn.badgeBounds =
        vn.childType === "1" ? zeroBounds : badgedRectBadgeBounds;
      vn.EntityShape = InterfaceShape;
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
      break;
    case "BusinessActor":
      vn.badge = "#archimate-actor-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Artifact":
      vn.badge = "archimate-artifact-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = ArtifactShape;
      break;
    case "Assessment":
      vn.badge = "#archimate-assessment-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Driver":
      vn.badge = "#archimate-driver-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Constraint":
      vn.badge = "#archimate-constraint-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Goal":
      vn.badge = "#archimate-goal-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Outcome":
      vn.badge = "#archimate-outcome-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Principle":
      vn.badge = "#archimate-principle-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Requirement":
      vn.badge = "#archimate-requirement-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "Stakeholder":
      vn.badge = "#archimate-stakeholder-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = MotivationShape;
      break;
    case "BusinessObject":
    case "DataObject":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = DataObjectShape;
      break;
    case "BusinessRole":
      vn.badge = "#archimate-role-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Contract":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = ContractShape;
      break;
    case "Deliverable":
      vn.badge = "archimate-artifact-badge";
      vn.EntityShape = DeliverableShape;
      break;
    case "Gap":
      vn.backgroundClass = "archimate-implementation2-background";
      vn.badge = "#archimate-gap-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = DeliverableShape;
      break;
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      vn.backgroundClass = "archimate-diagram-model-reference-background";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Device":
      vn.badge = vn.childType === "1" ? "#archimate-device-badge" : undefined;
      vn.badgeBounds =
        vn.childType === "1" ? badgedNodeBadgeBounds : zeroBounds;
      vn.textBounds = vn.childType === "1" ? nodeTextBounds : defaultTextBounds;
      vn.EntityShape = DeviceShape;
      break;
    case "Plateau":
      vn.backgroundClass = "archimate-implementation2-background";
      vn.badge = "#archimate-plateau-badge";
      vn.EntityShape = BadgedNodeShape;
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
      break;
    case "DistributionNetwork":
      vn.badge = "#archimate-distribution-network-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Group":
      vn.backgroundClass = "archimate-group-background";
      vn.textAlign = "left";
      vn.textBounds = groupTextBounds;
      vn.EntityShape = GroupShape;
      break;
    case "Grouping":
      vn.backgroundClass = "archimate-grouping-background";
      vn.textAlign = "left";
      vn.textBounds = groupTextBounds;
      vn.EntityShape = GroupingShape;
      break;
    case "Location":
      vn.backgroundClass = "archimate-location-background";
      vn.badge = "#archimate-location-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Meaning":
      vn.EntityShape = MeaningShape;
      break;
    case "CommunicationNetwork":
    case "Network":
      vn.badge = "#archimate-network-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Path":
      vn.badge = "#archimate-communication-path-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "Resource":
      vn.badge = "#archimate-resource-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "SystemSoftware":
      vn.badge = "#archimate-system-software-badge";
      vn.badgeBounds = badgedRectBadgeBounds;
      vn.EntityShape = BadgedRectShape;
      break;
    case "DiagramObject":
    case "Note":
      vn.backgroundClass = "archimate-note-background";
      vn.textAlign = "left";
      vn.EntityShape = NoteShape;
      break;
    case "Product":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = ProductShape;
      break;
    case "Representation":
      vn.textBounds = dataObjectTextBounds;
      vn.EntityShape = RepresentationShape;
      break;
    case "SketchModelSticky":
      vn.backgroundClass = "archimate-sticky-background";
      break;
    case "Value":
      vn.textBounds = valueTextBounds;
      vn.backgroundClass = "archimate-motivation-background";
      vn.EntityShape = ValueShape;
      break;
    case "WorkPackage":
      vn.EntityShape = BadgedRoundedRectShape;
      break;
  }
}
