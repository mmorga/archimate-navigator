import { CSSProperties, JSX } from "react";
import { Bounds, ViewNode } from "../../../archimate-model";

export function path(
  bounds: Bounds,
  backgroundClass: string | undefined,
  style: CSSProperties | undefined,
): JSX.Element {
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={style}
    />
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  const absolutePosition = viewNode.absolutePosition();
  return new Bounds(
    absolutePosition.right - 25,
    absolutePosition.top + 5,
    20,
    20,
  );
}

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
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
