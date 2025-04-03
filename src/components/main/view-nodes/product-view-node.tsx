import { CSSProperties, JSX } from "react";
import { ViewNode } from "../../../archimate-model";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <g className={backgroundClass}>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height="8"
        className="archimate-decoration"
      />
    </g>
  );
}
