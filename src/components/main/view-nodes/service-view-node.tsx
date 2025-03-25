import { Bounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import * as React from "react";
import { JSX } from "react";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return servicePath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRoundedRectViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  }
}

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 7,
    bounds.top + 5,
    bounds.width - 14,
    bounds.height - 10,
  );
}

function servicePath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.left}
      y={bounds.top}
      width={bounds.width}
      height={bounds.height}
      rx={bounds.height / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}
