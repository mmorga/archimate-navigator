import * as React from "react";
import { LogicError, ViewNode } from "../../archimate-model";
import { entityClickedFunc } from "../common";
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

interface IProps {
  viewNode: ViewNode;
  onClicked?: entityClickedFunc;
  selected: boolean;
}

export default class ArchimateViewNode extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const elType = this.elementType();
    switch(elType) {
      case "AndJunction": 
      case "Junction":
        return <JunctionViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "OrJunction":
        return <OrJunctionViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationCollaboration":
      case "BusinessCollaboration":
      case "TechnologyCollaboration":
        return <CollaborationViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationComponent":
        return <ApplicationComponentViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationEvent":
      case "BusinessEvent":
      case "TechnologyEvent":
        return <EventViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationFunction":
      case "BusinessFunction":
      case "TechnologyFunction":
        return <FunctionViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationInteraction":
      case "BusinessInteraction":
      case "TechnologyInteraction":
        return <InteractionViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationInterface":
      case "BusinessInterface":
      case "TechnologyInterface":
       return <InterfaceViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationProcess":
      case "BusinessProcess":
      case "TechnologyProcess":
        return <ProcessViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "ApplicationService":
      case "BusinessService":
      case "TechnologyService":
        return <ServiceViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "BusinessActor":
        return <BusinessActorViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Artifact":
        return <ArtifactViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Assessment":
        return <AssessmentViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Driver":
        return <DriverViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Constraint":
        return <ConstraintViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Goal":
        return <GoalViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Outcome":
        return <OutcomeViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Principle":
        return <PrincipleViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Requirement":
        return <RequirementViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Stakeholder":
        return <StakeholderViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "BusinessObject":
      case "DataObject":
        return <DataObjectViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "BusinessRole":
        return <BusinessRoleViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Contract":
        return <ContractViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Deliverable":
        return <DeliverableViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Gap":
        return <GapViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "DiagramModelReference":
      case "ArchimateDiagramModel":
      case "DiagramModel":
        return <DiagramRefViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Device":
        return <DeviceViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Plateau":
        return <PlateauViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Node":
       return <NodeViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "DistributionNetwork":
        return <DistributionNetworkViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Group":
        return <GroupViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Grouping":
       return <GroupingViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Location":
        return <LocationViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Meaning":
        return <MeaningViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "CommunicationNetwork":
      case "Network":
        return <NetworkViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Path":
        return <PathViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Resource":
        return <ResourceViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "SystemSoftware":
        return <SystemSoftwareViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "DiagramObject":
      case "Note":
        return <NoteViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Product":
        return <ProductViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Representation":
        return <RepresentationViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "SketchModelSticky":
        return <StickyViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "Value":
        return <ValueViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      case "WorkPackage":
        return <WorkPackageViewNode viewNode={this.props.viewNode} onClicked={this.props.onClicked} selected={this.props.selected} />
      default:
        throw new LogicError(`Unexpected view node type ${elType}`);
    }
  }

  private elementType(): string {
    const elInst = this.props.viewNode.entityInstance();
    if (elInst) {
      return elInst.type;
    } else {
      return this.props.viewNode.type;
    }
  }
}
