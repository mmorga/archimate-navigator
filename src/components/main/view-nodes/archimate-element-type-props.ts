import {
  Bounds,
  IEntity,
  ViewNode,
  zeroBounds,
} from "../../../archimate-model";
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
import type {
  EnterEntityShapeFunc,
  EntityShapeComponent,
} from "./entity-shape-component";
import type * as CSS from "csstype";
import ValueShape, { enterValueShape, valueTextBounds } from "./value-shape";

export type IArchimateViewNodeState = {
  badge: string | undefined;
  backgroundClass: string;
  entity: IEntity | undefined;
  textAlign: CSS.Property.TextAlign;
  badgeBounds(viewNode: ViewNode): Bounds | undefined;
  textBounds(viewNode: ViewNode, x?: number, y?: number): Bounds;
  EntityShape: EntityShapeComponent;
  enterEntityShapeFunc: EnterEntityShapeFunc;
};

export default function archimateElementTypeProps(
  viewNode: ViewNode,
): Partial<IArchimateViewNodeState> {
  switch (viewNode.elementType()) {
    case "AndJunction":
    case "Junction":
      return {
        backgroundClass: "archimate-junction-background",
        EntityShape: JunctionShape,
        enterEntityShapeFunc: enterJunctionShape,
      };
    case "OrJunction":
      return {
        backgroundClass: "archimate-or-junction-background",
        EntityShape: JunctionShape,
        enterEntityShapeFunc: enterJunctionShape,
      };
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      return {
        badge: "#archimate-collaboration-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "ApplicationComponent":
      return {
        badge:
          viewNode.childType === "1"
            ? "#archimate-app-component-badge"
            : undefined,
        badgeBounds:
          viewNode.childType === "1" ? badgedRectBadgeBounds : zeroBounds,
        textBounds: applicationComponentTextBounds,
        EntityShape: ApplicationComponentShape,
        enterEntityShapeFunc: enterApplicationComponentShape,
      };
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      return {
        EntityShape: EventShape,
        enterEntityShapeFunc: enterEventShape,
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-event-badge",
        badgeBounds: eventBadgeBounds,
        textBounds: eventTextBounds,
      };
    case "ApplicationFunction":
    case "BusinessFunction":
    case "TechnologyFunction":
      return {
        badge: "#archimate-function-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRoundedRectShape,
        enterEntityShapeFunc: enterBadgedRoundedRectShape,
      };
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      return {
        badge: "#archimate-interaction-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRoundedRectShape,
        enterEntityShapeFunc: enterBadgedRoundedRectShape,
      };
    case "ApplicationInterface":
    case "BusinessInterface":
    case "TechnologyInterface":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-interface-badge",
        badgeBounds:
          viewNode.childType === "1" ? undefined : badgedRectBadgeBounds,
        EntityShape: InterfaceShape,
        enterEntityShapeFunc: enterInterfaceShape,
      };
    case "ApplicationProcess":
    case "BusinessProcess":
    case "TechnologyProcess":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-process-badge",
        badgeBounds:
          viewNode.childType === "1" ? zeroBounds : badgedRectBadgeBounds,
        textBounds:
          viewNode.childType === "1" ? processTextBounds : defaultTextBounds,
        EntityShape: ProcessShape,
        enterEntityShapeFunc: enterProcessShape,
      };
    case "ApplicationService":
    case "BusinessService":
    case "TechnologyService":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-service-badge",
        badgeBounds:
          viewNode.childType === "1" ? zeroBounds : badgedRectBadgeBounds,
        textBounds:
          viewNode.childType === "1" ? serviceTextBounds : defaultTextBounds,
        EntityShape: ServiceShape,
        enterEntityShapeFunc: enterServiceShape,
      };
    case "BusinessActor":
      return {
        badge: "#archimate-actor-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Artifact":
      return {
        badge: "archimate-artifact-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: ArtifactShape,
        enterEntityShapeFunc: enterArtifactShape,
      };
    case "Assessment":
      return {
        badge: "#archimate-assessment-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Driver":
      return {
        badge: "#archimate-driver-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Constraint":
      return {
        badge: "#archimate-constraint-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Goal":
      return {
        badge: "#archimate-goal-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Outcome":
      return {
        badge: "#archimate-outcome-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Principle":
      return {
        badge: "#archimate-principle-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Requirement":
      return {
        badge: "#archimate-requirement-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "Stakeholder":
      return {
        badge: "#archimate-stakeholder-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
        enterEntityShapeFunc: enterMotivationShape,
      };
    case "BusinessObject":
    case "DataObject":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: DataObjectShape,
        enterEntityShapeFunc: enterDataObjectShape,
      };
    case "BusinessRole":
      return {
        badge: "#archimate-role-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Contract":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: ContractShape,
        enterEntityShapeFunc: enterContractShape,
      };
    case "Deliverable":
      return {
        badge: "archimate-artifact-badge",
        EntityShape: DeliverableShape,
        enterEntityShapeFunc: enterDeliverableShape,
      };
    case "Gap":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-gap-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: DeliverableShape,
        enterEntityShapeFunc: enterDeliverableShape,
      };
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      return {
        backgroundClass: "archimate-diagram-model-reference-background",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Device":
      return {
        badge:
          viewNode.childType === "1" ? "#archimate-device-badge" : undefined,
        badgeBounds:
          viewNode.childType === "1" ? badgedNodeBadgeBounds : zeroBounds,
        textBounds:
          viewNode.childType === "1" ? nodeTextBounds : defaultTextBounds,
        EntityShape: DeviceShape,
        enterEntityShapeFunc: enterDeviceShape,
      };
    case "Plateau":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-plateau-badge",
        EntityShape: BadgedNodeShape,
        enterEntityShapeFunc: enterBadgedNodeShape,
        badgeBounds: badgedNodeBadgeBounds,
        textBounds: nodeTextBounds,
      };
    case "Node":
      return {
        badge: viewNode.childType === "1" ? "#archimate-node-badge" : undefined,
        badgeBounds:
          viewNode.childType === "1" ? badgedRectBadgeBounds : zeroBounds,
        textBounds:
          viewNode.childType === "1" ? badgedNodeTextBounds : nodeTextBounds,
        EntityShape: NodeShape,
        enterEntityShapeFunc: enterNodeShape,
      };
    case "DistributionNetwork":
      return {
        badge: "#archimate-distribution-network-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Group":
      return {
        backgroundClass: "archimate-group-background",
        textAlign: "left",
        textBounds: groupTextBounds,
        EntityShape: GroupShape,
        enterEntityShapeFunc: enterGroupShape,
      };
    case "Grouping":
      return {
        backgroundClass: "archimate-grouping-background",
        textAlign: "left",
        textBounds: groupTextBounds,
        EntityShape: GroupingShape,
        enterEntityShapeFunc: enterGroupingShape,
      };
    case "Location":
      return {
        backgroundClass: "archimate-location-background",
        badge: "#archimate-location-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Meaning":
      return {
        EntityShape: MeaningShape,
        enterEntityShapeFunc: enterMeaningShape,
      };
    case "CommunicationNetwork":
    case "Network":
      return {
        badge: "#archimate-network-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Path":
      return {
        badge: "#archimate-communication-path-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "Resource":
      return {
        badge: "#archimate-resource-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "SystemSoftware":
      return {
        badge: "#archimate-system-software-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
        enterEntityShapeFunc: enterBadgedRectShape,
      };
    case "DiagramObject":
    case "Note":
      return {
        backgroundClass: "archimate-note-background",
        textAlign: "left",
        EntityShape: NoteShape,
        enterEntityShapeFunc: enterNoteShape,
      };
    case "Product":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: ProductShape,
        enterEntityShapeFunc: enterProductShape,
      };
    case "Representation":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: RepresentationShape,
        enterEntityShapeFunc: enterRepresentationShape,
      };
    case "SketchModelSticky":
      return {
        backgroundClass: "archimate-sticky-background",
      };
    case "Value":
      return {
        textBounds: valueTextBounds,
        backgroundClass: "archimate-motivation-background",
        EntityShape: ValueShape,
        enterEntityShapeFunc: enterValueShape,
      };
    case "WorkPackage":
      return {
        EntityShape: BadgedRoundedRectShape,
        enterEntityShapeFunc: enterBadgedRoundedRectShape,
      };
    default:
      return {};
  }
}
