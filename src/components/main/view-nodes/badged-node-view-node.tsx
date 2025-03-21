import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";

export function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const margin = 14;
  const nodeBoxHeight = bounds.height - margin;
  const nodeBoxWidth = bounds.width - margin;
  return (
    <g className={backgroundClass} style={shapeStyle}>
      <path
        d={[
          "M",
          bounds.left,
          bounds.bottom,
          "v",
          -nodeBoxHeight,
          "l",
          margin,
          -margin,
          "h",
          nodeBoxWidth,
          "v",
          nodeBoxHeight,
          "l",
          -margin,
          margin,
          "z"
        ].join(" ")}
      />
      <path
        d={[
          "M",
          bounds.left,
          bounds.top + margin,
          "l",
          margin,
          -margin,
          "h",
          nodeBoxWidth,
          "v",
          nodeBoxHeight,
          "l",
          -margin,
          margin,
          "v",
          -nodeBoxHeight,
          "z",
          "M",
          bounds.right,
          bounds.top,
          "l",
          -margin,
          margin
        ].join(" ")}
        className="archimate-decoration"
      />
      <path
        d={[
          "M",
          bounds.left,
          bounds.top + margin,
          "h",
          nodeBoxWidth,
          "l",
          margin,
          -margin,
          "M",
          bounds.left + nodeBoxWidth,
          bounds.bottom,
          "v",
          -nodeBoxHeight
        ].join(" ")}
        style={{ fill: "none", stroke: "inherit" }}
      />
    </g>
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  const margin = 14;
  return new Bounds(
    bounds.right - margin - 25,
    bounds.top + margin + 5,
    20,
    20
  );
}

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  const margin = 14;
  const nodeBoxHeight = bounds.height - margin;
  const nodeBoxWidth = bounds.width - margin;
  return new Bounds(
    bounds.left + 1,
    bounds.top + margin + 1,
    nodeBoxWidth - 2,
    nodeBoxHeight - 2
  );
}
