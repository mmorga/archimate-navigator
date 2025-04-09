import {
  Bounds,
  IEntity,
  ViewNode,
  zeroBounds,
} from "../../../archimate-model";
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
import type { EntityShapeComponent } from "./entity-shape-component";
import type * as CSS from "csstype";
import ValueShape, { valueTextBounds } from "./value-shape";

export type IArchimateViewNodeState = {
  badge: string | undefined;
  backgroundClass: string;
  entity: IEntity | undefined;
  textAlign: CSS.Property.TextAlign;
  badgeBounds(viewNode: ViewNode): Bounds | undefined;
  textBounds(viewNode: ViewNode, x?: number, y?: number): Bounds;
  EntityShape: EntityShapeComponent;
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
      };
    case "OrJunction":
      return {
        backgroundClass: "archimate-or-junction-background",
        EntityShape: JunctionShape,
      };
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      return {
        badge: "#archimate-collaboration-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
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
      };
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      return {
        EntityShape: EventShape,
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
      };
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      return {
        badge: "#archimate-interaction-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRoundedRectShape,
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
      };
    case "BusinessActor":
      return {
        badge: "#archimate-actor-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Artifact":
      return {
        badge: "archimate-artifact-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: ArtifactShape,
      };
    case "Assessment":
      return {
        badge: "#archimate-assessment-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Driver":
      return {
        badge: "#archimate-driver-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Constraint":
      return {
        badge: "#archimate-constraint-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Goal":
      return {
        badge: "#archimate-goal-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Outcome":
      return {
        badge: "#archimate-outcome-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Principle":
      return {
        badge: "#archimate-principle-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Requirement":
      return {
        badge: "#archimate-requirement-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "Stakeholder":
      return {
        badge: "#archimate-stakeholder-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: MotivationShape,
      };
    case "BusinessObject":
    case "DataObject":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: DataObjectShape,
      };
    case "BusinessRole":
      return {
        badge: "#archimate-role-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Contract":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: ContractShape,
      };
    case "Deliverable":
      return {
        badge: "archimate-artifact-badge",
        EntityShape: DeliverableShape,
      };
    case "Gap":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-gap-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: DeliverableShape,
      };
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      return {
        backgroundClass: "archimate-diagram-model-reference-background",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
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
      };
    case "Plateau":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-plateau-badge",
        EntityShape: BadgedNodeShape,
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
      };
    case "DistributionNetwork":
      return {
        badge: "#archimate-distribution-network-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Group":
      return {
        backgroundClass: "archimate-group-background",
        textAlign: "left",
        textBounds: groupTextBounds,
        EntityShape: GroupShape,
      };
    case "Grouping":
      return {
        backgroundClass: "archimate-grouping-background",
        textAlign: "left",
        textBounds: groupTextBounds,
        EntityShape: GroupingShape,
      };
    case "Location":
      return {
        backgroundClass: "archimate-location-background",
        badge: "#archimate-location-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Meaning":
      return {
        EntityShape: MeaningShape,
      };
    case "CommunicationNetwork":
    case "Network":
      return {
        badge: "#archimate-network-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Path":
      return {
        badge: "#archimate-communication-path-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "Resource":
      return {
        badge: "#archimate-resource-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "SystemSoftware":
      return {
        badge: "#archimate-system-software-badge",
        badgeBounds: badgedRectBadgeBounds,
        EntityShape: BadgedRectShape,
      };
    case "DiagramObject":
    case "Note":
      return {
        backgroundClass: "archimate-note-background",
        textAlign: "left",
        EntityShape: NoteShape,
      };
    case "Product":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: ProductShape,
      };
    case "Representation":
      return {
        textBounds: dataObjectTextBounds,
        EntityShape: RepresentationShape,
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
      };
    case "WorkPackage":
      return {
        EntityShape: BadgedRoundedRectShape,
      };
    default:
      return {};
  }
}
