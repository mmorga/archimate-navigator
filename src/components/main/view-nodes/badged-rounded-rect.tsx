import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";

export function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.left}
      y={bounds.top}
      width={bounds.width}
      height={bounds.height}
      rx={"5"}
      ry={"5"}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.right - 25, bounds.top + 5, 20, 20);
}
