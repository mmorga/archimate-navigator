import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 10,
    bounds.top + 10,
    bounds.width - 20,
    bounds.height - 20,
  );
}

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const cx = bounds.left + bounds.width / 2.0;
  const rx = bounds.width / 2.0 - 1;
  const cy = bounds.top + bounds.height / 2.0;
  const ry = bounds.height / 2.0 - 1;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      className={backgroundClass}
      style={{
        fill: viewNode.style?.fillColor?.toRGBA(),
        stroke: viewNode.style?.lineColor?.toRGBA(),
        strokeWidth: viewNode.style?.lineWidth,
      }}
    />
  );
}
