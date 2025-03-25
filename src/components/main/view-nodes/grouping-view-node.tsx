import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";
import * as React from "react";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const groupHeaderHeight = 21;
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
      <path
        d={[
          "M",
          bounds.left,
          bounds.top + groupHeaderHeight - 1,
          "v",
          -(groupHeaderHeight - 1),
          "h",
          bounds.width / 2,
          "v",
          groupHeaderHeight - 1,
        ].join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
    </>
  );
}
