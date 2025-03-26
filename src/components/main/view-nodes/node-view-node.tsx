import { JSX } from "react";
import { Bounds, ViewNode } from "../../../archimate-model";
import * as BadgedNodeViewNode from "./badged-node-view-node";
import * as BadgedRect from "./badged-rect";
import * as React from "react";
import * as BaseViewNode from "./base-view-node";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return BadgedRect.path(
      viewNode.absolutePosition(),
      backgroundClass,
      shapeStyle,
    );
  } else {
    return BadgedNodeViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  }
}

export function textBounds(viewNode: ViewNode): Bounds {
  const textBounds = BaseViewNode.textBounds(viewNode);
  const margin: number = 14;
  return new Bounds(
    textBounds.left,
    textBounds.top + margin,
    textBounds.width,
    textBounds.height - margin,
  );
}
