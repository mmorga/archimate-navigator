import { Bounds } from "../../../archimate-model";
import { JSX } from "react";
import { ViewNode } from "@/archimate-model";
import * as React from "react";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const margin = 10;
  const width = bounds.width - margin * 2;
  const height = bounds.height - margin * 2;
  return (
    <path
      d={[
        "M",
        bounds.left + margin,
        bounds.top,
        "h",
        width,
        "l",
        margin,
        margin,
        "v",
        height,
        "l",
        -margin,
        margin,
        "h",
        -width,
        "l",
        -margin,
        -margin,
        "v",
        -height,
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.right - 25, bounds.top + 5, 20, 20);
}
