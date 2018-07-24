import { LogicError, ViewNode } from "../../archimate-model";
import "./archimate-svg.css";
import ApplicationComponentViewNode from "./view-nodes/application-component-view-node";
import ArtifactViewNode from "./view-nodes/artifact-view-node";
import AssessmentViewNode from "./view-nodes/assessment-view-node";
import BusinessActorViewNode from "./view-nodes/business-actor-view-node";
import BusinessRoleViewNode from "./view-nodes/business-role-view-node";
import CollaborationViewNode from "./view-nodes/collaboration-view-node";
import ConstraintViewNode from "./view-nodes/constraint-view-node";
import ContractViewNode from "./view-nodes/contract-view-node";
import DataObjectViewNode from "./view-nodes/data-object-view-node";
import DeliverableViewNode from "./view-nodes/deliverable-view-node";
import DeviceViewNode from "./view-nodes/device-view-node";
import DiagramRefViewNode from "./view-nodes/diagram-ref-view-node";
import DistributionNetworkViewNode from "./view-nodes/distribution-network-view-node";
import DriverViewNode from "./view-nodes/driver-view-node";
import EventViewNode from "./view-nodes/event-view-node";
import FunctionViewNode from "./view-nodes/function-view-node";
import GapViewNode from "./view-nodes/gap-view-node";
import GoalViewNode from "./view-nodes/goal-view-node";
import GroupViewNode from "./view-nodes/group-view-node";
import GroupingViewNode from "./view-nodes/grouping-view-node";
import InteractionViewNode from "./view-nodes/interaction-view-node";
import InterfaceViewNode from "./view-nodes/interface-view-node";
import JunctionViewNode from "./view-nodes/junction";
import LocationViewNode from "./view-nodes/location-view-node";
import MeaningViewNode from "./view-nodes/meaning-view-node";
import NetworkViewNode from "./view-nodes/network-view-node";
import NodeViewNode from "./view-nodes/node-view-node";
import NoteViewNode from "./view-nodes/note-view-node";
import OrJunctionViewNode from "./view-nodes/or-junction";
import OutcomeViewNode from "./view-nodes/outcome-view-node";
import PathViewNode from "./view-nodes/path-view-node";
import PlateauViewNode from "./view-nodes/plateau-view-node";
import PrincipleViewNode from "./view-nodes/principle-view-node";
import ProcessViewNode from "./view-nodes/process-view-node";
import ProductViewNode from "./view-nodes/product-view-node";
import RepresentationViewNode from "./view-nodes/representation-view-node";
import RequirementViewNode from "./view-nodes/requirement-view-node";
import ResourceViewNode from "./view-nodes/resource-view-node";
import ServiceViewNode from "./view-nodes/service-view-node";
import StakeholderViewNode from "./view-nodes/stakeholder-view-node";
import StickyViewNode from "./view-nodes/sticky-view-node";
import SystemSoftwareViewNode from "./view-nodes/system-software-view-node";
import ValueViewNode from "./view-nodes/value-view-node";
import WorkPackageViewNode from "./view-nodes/work-package-view-node";

export default function archimateViewNode(viewNode: ViewNode) {
  const elType = elementType(viewNode);
  switch(elType) {
    case "AndJunction": 
    case "Junction":
      return JunctionViewNode;
    case "OrJunction":
      return OrJunctionViewNode;
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      return CollaborationViewNode;
    case "ApplicationComponent":
      return ApplicationComponentViewNode;
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      return EventViewNode;
    case "ApplicationFunction":
    case "BusinessFunction":
    case "TechnologyFunction":
      return FunctionViewNode;
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      return InteractionViewNode;
    case "ApplicationInterface":
    case "BusinessInterface":
    case "TechnologyInterface":
      return InterfaceViewNode;
    case "ApplicationProcess":
    case "BusinessProcess":
    case "TechnologyProcess":
      return ProcessViewNode;
    case "ApplicationService":
    case "BusinessService":
    case "TechnologyService":
      return ServiceViewNode;
    case "BusinessActor":
      return BusinessActorViewNode;
    case "Artifact":
      return ArtifactViewNode;
    case "Assessment":
      return AssessmentViewNode;
    case "Driver":
      return DriverViewNode;
    case "Constraint":
      return ConstraintViewNode;
    case "Goal":
      return GoalViewNode;
    case "Outcome":
      return OutcomeViewNode;
    case "Principle":
      return PrincipleViewNode;
    case "Requirement":
      return RequirementViewNode;
    case "Stakeholder":
      return StakeholderViewNode;
    case "BusinessObject":
    case "DataObject":
      return DataObjectViewNode;
    case "BusinessRole":
      return BusinessRoleViewNode;
    case "Contract":
      return ContractViewNode;
    case "Deliverable":
      return DeliverableViewNode;
    case "Gap":
      return GapViewNode;
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      return DiagramRefViewNode;
    case "Device":
      return DeviceViewNode;
    case "Plateau":
      return PlateauViewNode;
    case "Node":
      return NodeViewNode;
    case "DistributionNetwork":
      return DistributionNetworkViewNode;
    case "Group":
      return GroupViewNode;
    case "Grouping":
      return GroupingViewNode;
    case "Location":
      return LocationViewNode;
    case "Meaning":
      return MeaningViewNode;
    case "CommunicationNetwork":
    case "Network":
      return NetworkViewNode;
    case "Path":
      return PathViewNode;
    case "Resource":
      return ResourceViewNode;
    case "SystemSoftware":
      return SystemSoftwareViewNode;
    case "DiagramObject":
    case "Note":
      return NoteViewNode;
    case "Product":
      return ProductViewNode;
    case "Representation":
      return RepresentationViewNode;
    case "SketchModelSticky":
      return StickyViewNode;
    case "Value":
      return ValueViewNode;
    case "WorkPackage":
      return WorkPackageViewNode;
    default:
      throw new LogicError(`Unexpected view node type ${elType}`);
  }
}

function elementType(viewNode: ViewNode): string {
  const elInst = viewNode.entityInstance();
  if (elInst) {
    return elInst.type;
  } else {
    return viewNode.type;
  }
}
