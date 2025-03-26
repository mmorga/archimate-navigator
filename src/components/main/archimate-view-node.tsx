import type * as CSS from "csstype";
import * as React from "react";
import { JSX } from "react";
import "./archimate-svg.css";
import {
  Bounds,
  elementTypeLayer,
  elementTypeOfString,
  IEntity,
  layerClassName,
  ViewNode,
  zeroBounds,
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import * as ApplicationConponentViewNode from "./view-nodes/application-component-view-node";
import * as ArtifactViewNode from "./view-nodes/artifact-view-node";
import * as BadgedNodeViewNode from "./view-nodes/badged-node-view-node";
import * as BadgedRect from "./view-nodes/badged-rect";
import * as BadgedRoundedRectViewNode from "./view-nodes/badged-rounded-rect";
import * as BaseViewNode from "./view-nodes/base-view-node";
import * as ContractViewNode from "./view-nodes/contract-view-node";
import * as DataObjectViewNode from "./view-nodes/data-object-view-node";
import * as DeliverableViewNode from "./view-nodes/deliverable-view-node";
import * as DeviceViewNode from "./view-nodes/device-view-node";
import * as EventViewNode from "./view-nodes/event-view-node";
import * as GapViewNode from "./view-nodes/gap-view-node";
import * as GroupingViewNode from "./view-nodes/grouping-view-node";
import * as GroupViewNode from "./view-nodes/group-view-node";
import * as InterfaceViewNode from "./view-nodes/interface-view-node";
import * as JunctionViewNode from "./view-nodes/junction";
import * as MeaningViewNode from "./view-nodes/meaning-view-node";
import * as MotivationViewNode from "./view-nodes/motivation-view-node";
import * as NodeViewNode from "./view-nodes/node-view-node";
import * as NoteViewNode from "./view-nodes/note-view-node";
import * as ProcessViewNode from "./view-nodes/process-view-node";
import * as ProductViewNode from "./view-nodes/product-view-node";
import * as RepresentationViewNode from "./view-nodes/representation-view-node";
import * as ServiceViewNode from "./view-nodes/service-view-node";
import * as ValueViewNode from "./view-nodes/value-view-node";
import SelectedViewNode from "./selected-view-node";
import EntityBadge from "./view-nodes/entity-badge";

interface IArchimateViewNodeProps {
  viewNode: ViewNode;
  onClicked: entityClickedFunc;
  selected: boolean;
  x: number;
  y: number;
}

export const ArchimateViewNode: React.FC<IArchimateViewNodeProps> = (props) => {
  const attrs: React.SVGProps<SVGGElement> = { id: props.viewNode.id };
  if (props.viewNode.type && props.viewNode.type.length > 0) {
    attrs.className = `archimate-${props.viewNode.elementType()}`;
  }
  if (props.onClicked) {
    attrs.onClick = props.onClicked.bind(null, props.viewNode.entityInstance());
  }

  const archimateProps = archimateViewNodeProps(props.viewNode);

  return (
    <g {...attrs}>
      <Title name={props.viewNode.name} />
      <Documentation documentation={props.viewNode.documentation} />
      {archimateProps.entityShape(
        props.viewNode,
        archimateProps.backgroundClass,
        shapeStyle(props.viewNode),
      )}
      <EntityBadge
        bounds={archimateProps.badgeBounds(props.viewNode)}
        badge={archimateProps.badge}
      />
      {archimateProps.entityLabel(
        props.viewNode,
        archimateProps.textBounds(props.viewNode, props.x, props.y),
        archimateProps.textAlign || "center",
        archimateProps.badgeBounds(props.viewNode),
      )}
      <SelectedViewNode
        bounds={props.viewNode.absolutePosition()}
        selected={props.selected}
      />
    </g>
  );
};

function Title({ name }: { name: string | undefined }) {
  if (name && name.length > 0) {
    return <title>{name}</title>;
  }
  return undefined;
}

function Documentation({
  documentation,
}: {
  documentation: string | undefined;
}) {
  if (documentation) {
    return <desc>{documentation}</desc>;
  }
  return undefined;
}

export interface IArchimateViewNodeInstProps {
  badge: string | undefined;
  backgroundClass: string;
  entity: IEntity | undefined;
  textAlign: CSS.Property.TextAlign;
  badgeBounds(viewNode: ViewNode): Bounds | undefined;
  textBounds(viewNode: ViewNode, x?: number, y?: number): Bounds;
  entityShape(
    viewNode: ViewNode,
    backgroundClass: string | undefined,
    shapeStyle: React.CSSProperties | undefined,
  ): JSX.Element | undefined;
  entityLabel(
    viewNode: ViewNode,
    textBounds: Bounds,
    textAlign: CSS.Property.TextAlign,
    badgeBounds: Bounds | undefined,
  ): JSX.Element | undefined;
}

function archimateViewNodeProps(
  viewNode: ViewNode,
): IArchimateViewNodeInstProps {
  return {
    badge: undefined,
    backgroundClass: layerClassName(
      elementTypeLayer(elementTypeOfString(viewNode.elementType())),
    ),
    entity: viewNode.entityInstance(),
    textAlign: "center",
    badgeBounds: zeroBounds,
    textBounds: BaseViewNode.textBounds,
    entityShape: entityShape,
    entityLabel: BaseViewNode.entityLabel,
    ...elementProps(viewNode),
  };
}

function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
) {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

function shapeStyle(viewNode: ViewNode): React.CSSProperties {
  const style = viewNode.style;
  if (style === undefined) {
    return {};
  }
  const cssStyle: React.CSSProperties = {};
  if (style.fillColor) {
    cssStyle.fill = style.fillColor.toRGBA();
  }
  if (style.lineColor) {
    cssStyle.stroke = style.lineColor.toRGBA();
  }
  if (style.lineWidth) {
    cssStyle.strokeWidth = style.lineWidth;
  }
  return cssStyle;
}

function elementProps(
  viewNode: ViewNode,
): Partial<IArchimateViewNodeInstProps> {
  switch (viewNode.elementType()) {
    case "AndJunction":
    case "Junction":
      return {
        backgroundClass: "archimate-junction-background",
        entityShape: JunctionViewNode.entityShape,
        entityLabel: JunctionViewNode.entityLabel,
      };
    case "OrJunction":
      return {
        backgroundClass: "archimate-or-junction-background",
        entityShape: JunctionViewNode.entityShape,
        entityLabel: JunctionViewNode.entityLabel,
      };
    case "ApplicationCollaboration":
    case "BusinessCollaboration":
    case "TechnologyCollaboration":
      return {
        badge: "#archimate-collaboration-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "ApplicationComponent":
      return {
        badge:
          viewNode.childType === "1"
            ? "#archimate-app-component-badge"
            : undefined,
        badgeBounds:
          viewNode.childType === "1" ? BadgedRect.badgeBounds : zeroBounds,
        textBounds: ApplicationConponentViewNode.textBounds,
        entityShape: ApplicationConponentViewNode.entityShape,
      };
    case "ApplicationEvent":
    case "BusinessEvent":
    case "TechnologyEvent":
      return {
        entityShape: EventViewNode.entityShape,
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-event-badge",
        badgeBounds: EventViewNode.badgeBounds,
        textBounds: EventViewNode.textBounds,
      };
    case "ApplicationFunction":
    case "BusinessFunction":
    case "TechnologyFunction":
      return {
        badge: "#archimate-function-badge",
        badgeBounds: BadgedRoundedRectViewNode.badgeBounds,
        entityShape: BadgedRoundedRectViewNode.entityShape,
      };
    case "ApplicationInteraction":
    case "BusinessInteraction":
    case "TechnologyInteraction":
      return {
        badge: "#archimate-interaction-badge",
        badgeBounds: BadgedRoundedRectViewNode.badgeBounds,
        entityShape: BadgedRoundedRectViewNode.entityShape,
      };
    case "ApplicationInterface":
    case "BusinessInterface":
    case "TechnologyInterface":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-interface-badge",
        badgeBounds:
          viewNode.childType === "1" ? undefined : BadgedRect.badgeBounds,
        entityShape: InterfaceViewNode.interfaceEntityShape,
      };
    case "ApplicationProcess":
    case "BusinessProcess":
    case "TechnologyProcess":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-process-badge",
        badgeBounds:
          viewNode.childType === "1" ? zeroBounds : BadgedRect.badgeBounds,
        textBounds:
          viewNode.childType === "1"
            ? ProcessViewNode.textBounds
            : BaseViewNode.textBounds,
        entityShape: ProcessViewNode.entityShape,
      };
    case "ApplicationService":
    case "BusinessService":
    case "TechnologyService":
      return {
        badge:
          viewNode.childType === "1" ? undefined : "#archimate-service-badge",
        badgeBounds:
          viewNode.childType === "1"
            ? zeroBounds
            : BadgedRoundedRectViewNode.badgeBounds,
        textBounds:
          viewNode.childType === "1"
            ? ServiceViewNode.textBounds
            : BaseViewNode.textBounds,
        entityShape: ServiceViewNode.entityShape,
      };
    case "BusinessActor":
      return {
        badge: "#archimate-actor-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Artifact":
      return {
        badge: "archimate-artifact-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: ArtifactViewNode.artifactEntityShape,
      };
    case "Assessment":
      return {
        badge: "#archimate-assessment-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Driver":
      return {
        badge: "#archimate-driver-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Constraint":
      return {
        badge: "#archimate-constraint-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Goal":
      return {
        badge: "#archimate-goal-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Outcome":
      return {
        badge: "#archimate-outcome-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Principle":
      return {
        badge: "#archimate-principle-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Requirement":
      return {
        badge: "#archimate-requirement-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "Stakeholder":
      return {
        badge: "#archimate-stakeholder-badge",
        badgeBounds: MotivationViewNode.badgeBounds,
        entityShape: MotivationViewNode.entityShape,
      };
    case "BusinessObject":
    case "DataObject":
      return {
        textBounds: DataObjectViewNode.textBounds,
        entityShape: DataObjectViewNode.entityShape,
      };
    case "BusinessRole":
      return {
        badge: "#archimate-role-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Contract":
      return {
        textBounds: DataObjectViewNode.textBounds,
        entityShape: ContractViewNode.entityShape,
      };
    case "Deliverable":
      return {
        badge: "archimate-artifact-badge",
        entityShape: DeliverableViewNode.entityShape,
      };
    case "Gap":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-gap-badge",
        badgeBounds: GapViewNode.badgeBounds,
        entityShape: DeliverableViewNode.entityShape,
      };
    case "DiagramModelReference":
    case "ArchimateDiagramModel":
    case "DiagramModel":
      return {
        backgroundClass: "archimate-diagram-model-reference-background",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Device":
      return {
        badge:
          viewNode.childType === "1" ? "#archimate-device-badge" : undefined,
        badgeBounds:
          viewNode.childType === "1"
            ? BadgedNodeViewNode.badgeBounds
            : zeroBounds,
        textBounds:
          viewNode.childType === "1"
            ? NodeViewNode.textBounds
            : BaseViewNode.textBounds,
        entityShape: DeviceViewNode.entityShape,
      };
    case "Plateau":
      return {
        backgroundClass: "archimate-implementation2-background",
        badge: "#archimate-plateau-badge",
        entityShape: BadgedNodeViewNode.entityShape,
        badgeBounds: BadgedNodeViewNode.badgeBounds,
        textBounds: NodeViewNode.textBounds,
      };
    case "Node":
      return {
        badge: viewNode.childType === "1" ? "#archimate-node-badge" : undefined,
        badgeBounds:
          viewNode.childType === "1" ? BadgedRect.badgeBounds : zeroBounds,
        textBounds:
          viewNode.childType === "1"
            ? BadgedNodeViewNode.textBounds
            : NodeViewNode.textBounds,
        entityShape: NodeViewNode.entityShape,
      };
    case "DistributionNetwork":
      return {
        badge: "#archimate-distribution-network-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Group":
      return {
        backgroundClass: "archimate-group-background",
        textAlign: "left",
        textBounds: GroupViewNode.textBounds,
        entityShape: GroupViewNode.entityShape,
      };
    case "Grouping":
      return {
        backgroundClass: "archimate-grouping-background",
        textAlign: "left",
        textBounds: GroupViewNode.textBounds,
        entityShape: GroupingViewNode.entityShape,
      };
    case "Location":
      return {
        backgroundClass: "archimate-location-background",
        badge: "#archimate-location-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Meaning":
      return {
        entityShape: MeaningViewNode.meaningEntityShape,
      };
    case "CommunicationNetwork":
    case "Network":
      return {
        badge: "#archimate-network-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Path":
      return {
        badge: "#archimate-communication-path-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "Resource":
      return {
        badge: "#archimate-resource-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "SystemSoftware":
      return {
        badge: "#archimate-system-software-badge",
        badgeBounds: BadgedRect.badgeBounds,
        entityShape: BadgedRect.entityShape,
      };
    case "DiagramObject":
    case "Note":
      return {
        backgroundClass: "archimate-note-background",
        textAlign: "left",
        entityShape: NoteViewNode.entityShape,
      };
    case "Product":
      return {
        textBounds: DataObjectViewNode.textBounds,
        entityShape: ProductViewNode.entityShape,
      };
    case "Representation":
      return {
        textBounds: DataObjectViewNode.textBounds,
        entityShape: RepresentationViewNode.entityShape,
      };
    case "SketchModelSticky":
      return {
        backgroundClass: "archimate-sticky-background",
      };
    case "Value":
      return {
        textBounds: ValueViewNode.textBounds,
        backgroundClass: "archimate-motivation-background",
        entityShape: ValueViewNode.entityShape,
      };
    case "WorkPackage":
      return {
        entityShape: BadgedRoundedRectViewNode.entityShape,
      };
    default:
      return {};
  }
}
