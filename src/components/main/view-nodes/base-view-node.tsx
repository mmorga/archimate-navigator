import type * as CSS from "csstype";
import * as React from "react";
import { JSX } from "react";
import {
  Bounds,
  IEntity,
  Layer,
  layerClassName,
  ViewNode,
  zeroBounds,
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLabel from "../entity-label";
import SelectedViewNode from "../selected-view-node";

export interface IViewNodeProps {
  viewNode: ViewNode;
  onClicked?: entityClickedFunc;
  selected: boolean;
  x: number;
  y: number;
  badge?: string;
  backgroundClass?: string;
  entity?: IEntity | undefined;
  textAlign?: CSS.Property.TextAlign;
  margin?: number;
  bounds: IBoundsFunc;
  badgeBounds: IBadgeBoundsFunc;
  textBounds: ITextBoundsFunc;
  groupAttrs: IGroupAttrsFunc;
  title: ITitleFunc;
  desc: IDescFunc;
  entityShape: IEntityShapeFunc;
  shapeStyle: IShapeStyleFunc;
  entityBadge: IEntityBadgeFunc;
  entityLabel: IEntityLabelFunc;
  selectedHighlight: ISelectedHighlightFunc;
}

export interface IBoundsFunc {
  (viewNode: ViewNode, x?: number, y?: number): Bounds;
}

export interface IBadgeBoundsFunc {
  (viewNode: ViewNode): Bounds | undefined;
}

export interface ITextBoundsFunc {
  (viewNode: ViewNode, x?: number, y?: number): Bounds;
}

export interface IGroupAttrsFunc {
  (
    viewNode: ViewNode,
    onClicked: entityClickedFunc | undefined,
  ): React.SVGProps<SVGGElement>;
}

export interface ITitleFunc {
  (viewNode: ViewNode): JSX.Element | undefined;
}

export interface IDescFunc {
  (viewNode: ViewNode): JSX.Element | undefined;
}

export interface IEntityShapeFunc {
  (
    viewNode: ViewNode,
    backgroundClass: string | undefined,
    shapeStyle: React.CSSProperties | undefined,
  ): JSX.Element;
}

export interface IShapeStyleFunc {
  (viewNode: ViewNode): React.CSSProperties;
}

export interface IEntityBadgeFunc {
  (
    badgeBounds: Bounds | undefined,
    badge: string | undefined,
  ): JSX.Element | undefined;
}

export interface IEntityLabelFunc {
  (
    viewNode: ViewNode,
    textBounds: Bounds,
    textAlign: CSS.Property.TextAlign,
    badgeBounds: Bounds | undefined,
  ): JSX.Element | undefined;
}

export interface ISelectedHighlightFunc {
  (viewNode: ViewNode, selected: boolean): JSX.Element | undefined;
}

export function initialBounds(
  viewNode: ViewNode,
  x?: number,
  y?: number,
): Bounds {
  return new Bounds(
    x || viewNode.bounds.left,
    y || viewNode.bounds.top,
    viewNode.bounds.width,
    viewNode.bounds.height,
  );
}

export function archimateProps(
  viewNode: ViewNode,
  customState?: Partial<IViewNodeProps>,
): IViewNodeProps {
  return {
    viewNode: viewNode,
    onClicked: customState?.onClicked,
    selected: customState?.selected || false,
    x: customState?.x || viewNode.bounds.left,
    y: customState?.y || viewNode.bounds.top,
    badge: customState?.badge,
    backgroundClass:
      customState?.backgroundClass || defaultBackgroundClass(viewNode),
    entity: customState?.entity || viewNode.entityInstance(),
    textAlign: customState?.textAlign || "center",
    margin: customState?.margin || 8,
    bounds: customState?.bounds || initialBounds,
    badgeBounds: customState?.badgeBounds || zeroBounds,
    textBounds: customState?.textBounds || textBounds,
    groupAttrs: customState?.groupAttrs || groupAttrs,
    title: customState?.title || title,
    desc: customState?.desc || desc,
    entityShape: customState?.entityShape || entityShape,
    shapeStyle: customState?.shapeStyle || shapeStyle,
    entityBadge: customState?.entityBadge || entityBadge,
    entityLabel: customState?.entityLabel || entityLabel,
    selectedHighlight: customState?.selectedHighlight || selectedHighlight,
  };
}

export const ArchimateFC: React.FC<IViewNodeProps> = (props) => {
  return (
    <g {...props.groupAttrs(props.viewNode, props.onClicked)}>
      {props.title(props.viewNode)}
      {props.desc(props.viewNode)}
      {props.entityShape(
        props.viewNode,
        props.backgroundClass,
        props.shapeStyle(props.viewNode),
      )}
      {props.entityBadge(props.badgeBounds(props.viewNode), props.badge)}
      {props.entityLabel(
        props.viewNode,
        props.textBounds(props.viewNode, props.x, props.y),
        props.textAlign || "center",
        props.badgeBounds(props.viewNode),
      )}
      {props.selectedHighlight(props.viewNode, props.selected)}
    </g>
  );
};

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height).reducedBy(
    2,
  );
}

export function badgeBounds(): Bounds | undefined {
  return undefined;
}

export function groupAttrs(
  viewNode: ViewNode,
  onClicked: entityClickedFunc | undefined,
): React.SVGProps<SVGGElement> {
  const attrs: React.SVGProps<SVGGElement> = { id: viewNode.id };
  if (viewNode.type && viewNode.type.length > 0) {
    attrs.className = `archimate-${elementType(viewNode)}`;
  }
  if (onClicked) {
    attrs.onClick = onClicked.bind(null, viewNode.entityInstance());
  }
  return attrs;
}

export function title(viewNode: ViewNode) {
  if (viewNode.name && viewNode.name.length > 0) {
    return <title>{viewNode.name}</title>;
  }
  return undefined;
}

export function desc(viewNode: ViewNode) {
  if (viewNode.documentation) {
    return <desc>{viewNode.documentation}</desc>;
  }
  return undefined;
}

export function entityShape(
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

export function shapeStyle(viewNode: ViewNode): React.CSSProperties {
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

export function entityBadge(
  badgeBounds: Bounds | undefined,
  badge: string | undefined,
) {
  if (badge === undefined) {
    return undefined;
  }
  return <use href={badge} {...badgeBounds} />;
}

export function label(viewNode: ViewNode): string | undefined {
  if (viewNode.content && viewNode.content.length > 0) {
    return viewNode.content;
  }
  if (viewNode.name && viewNode.name.length > 0) {
    return viewNode.name;
  }
  const el = viewNode.entityInstance();
  if (el === undefined) {
    return undefined;
  }
  return el.name;
}

export function entityLabel(
  viewNode: ViewNode,
  textBounds: Bounds,
  textAlign: CSS.Property.TextAlign,
  badgeBounds: Bounds | undefined,
) {
  const optLabel = label(viewNode);
  if (optLabel === undefined) {
    return undefined;
  }
  return (
    <EntityLabel
      child={viewNode}
      label={optLabel}
      textBounds={textBounds || viewNode.absolutePosition().reducedBy(2)}
      textAlign={textAlign}
      badgeBounds={badgeBounds || zeroBounds()}
    />
  );
}

export function selectedHighlight(
  viewNode: ViewNode,
  selected: boolean,
): JSX.Element | undefined {
  if (selected) {
    return <SelectedViewNode bounds={viewNode.absolutePosition()} />;
  }
  return undefined;
}

export function defaultBackgroundClass(viewNode: ViewNode): string {
  switch (elementType(viewNode)) {
    case "BusinessActor":
    case "BusinessCollaboration":
    case "BusinessEvent":
    case "BusinessFunction":
    case "BusinessInteraction":
    case "BusinessInterface":
    case "BusinessObject":
    case "BusinessProcess":
    case "BusinessRole":
    case "BusinessService":
    case "Contract":
    case "Location":
    case "Product":
    case "Representation":
      return layerClassName(Layer.Business);
    case "ApplicationCollaboration":
    case "ApplicationComponent":
    case "ApplicationEvent":
    case "ApplicationFunction":
    case "ApplicationInteraction":
    case "ApplicationInterface":
    case "ApplicationProcess":
    case "ApplicationService":
    case "DataObject":
      return layerClassName(Layer.Application);
    case "Artifact":
    case "CommunicationNetwork":
    case "CommunicationPath":
    case "Device":
    case "InfrastructureFunction":
    case "InfrastructureInterface":
    case "InfrastructureService":
    case "Network":
    case "Node":
    case "Path":
    case "SystemSoftware":
    case "TechnologyCollaboration":
    case "TechnologyEvent":
    case "TechnologyFunction":
    case "TechnologyInteraction":
    case "TechnologyInterface":
    case "TechnologyObject":
    case "TechnologyProcess":
    case "TechnologyService":
      return layerClassName(Layer.Technology);
    case "DistributionNetwork":
    case "Equipment":
    case "Facility":
    case "Material":
      return layerClassName(Layer.Physical);
    case "Assessment":
    case "Constraint":
    case "Driver":
    case "Goal":
    case "Meaning":
    case "Outcome":
    case "Principle":
    case "Requirement":
    case "Stakeholder":
    case "Value":
      return layerClassName(Layer.Motivation);
    case "Deliverable":
    case "Gap":
    case "ImplementationEvent":
    case "Plateau":
    case "WorkPackage":
      return layerClassName(Layer.ImplementationAndMigration);
    case "AndJunction":
    case "Junction":
    case "OrJunction":
      return layerClassName(Layer.Connectors);
    case "Capability":
    case "CourseOfAction":
    case "Resource":
      return layerClassName(Layer.Strategy);
    case "Grouping":
    case "Group":
    default:
      return layerClassName(Layer.Other);
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
