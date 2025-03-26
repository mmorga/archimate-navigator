import type * as CSS from "csstype";
import { Bounds, ViewNode, zeroBounds } from "../../../archimate-model";
import EntityLabel from "../entity-label";

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height).reducedBy(
    2,
  );
}

function label(viewNode: ViewNode): string | undefined {
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
