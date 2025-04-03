import { Bounds } from "../../../archimate-model";
import { CSSProperties, JSX } from "react";
import { ViewNode } from "../../../archimate-model";

const groupHeaderHeight = 21;

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top + groupHeaderHeight}
        width={bounds.width}
        height={bounds.height - groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={"archimate-decoration"}
      />
      )
    </>
  );
}

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 3,
    bounds.top,
    bounds.width / 2.0 - 6,
    groupHeaderHeight,
  );
}
