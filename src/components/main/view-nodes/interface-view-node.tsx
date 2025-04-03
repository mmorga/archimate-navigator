import * as BadgedRect from "./badged-rect";
import { CSSProperties, JSX } from "react";
import { ViewNode } from "../../../archimate-model";

function elipsePath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <ellipse
      cx={bounds.left + bounds.width / 2.0}
      cy={bounds.top + bounds.height / 2.0}
      rx={bounds.width / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

export function interfaceEntityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return elipsePath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRect.entityShape(viewNode, backgroundClass, shapeStyle);
  }
}
