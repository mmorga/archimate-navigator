import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";
import * as BaseViewNode from "./base-view-node";
import * as React from "react";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const style = shapeStyle;
  const margin = 8;
  const decorStyle: React.CSSProperties = {
    stroke: style?.stroke,
    strokeWidth: style?.strokeWidth,
  };
  return (
    <g className={backgroundClass}>
      <rect
        key="data-background"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={style}
      />
      <rect
        key="data-decoration"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
        style={decorStyle}
      />
    </g>
  );
}

export function textBounds(viewNode: ViewNode): Bounds {
  const textBounds = BaseViewNode.textBounds(viewNode);
  const margin: number = 8;
  return new Bounds(
    textBounds.left,
    textBounds.top + margin,
    textBounds.width,
    textBounds.height - margin,
  );
}
