import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";
import * as BadgedNodeViewNode from "./badged-node-view-node";
import * as React from "react";

function path(
  viewNodeBounds: Bounds,
  backgroundClass: string | undefined,
  style: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNodeBounds;
  const margin = 10;
  const decorationPath = [
    "M",
    bounds.left + margin,
    bounds.bottom - margin,
    "l",
    -margin,
    margin,
    "h",
    bounds.width,
    "l",
    -margin,
    -margin,
    "z",
  ].join(" ");

  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height - margin}
        rx={"6"}
        ry={"6"}
        className={backgroundClass}
        style={style}
      />
      <path d={decorationPath} className={backgroundClass} style={style} />
      <path d={decorationPath} className="archimate-decoration" style={style} />
    </>
  );
}

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return BadgedNodeViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  } else {
    return path(viewNode.absolutePosition(), backgroundClass, shapeStyle);
  }
}
