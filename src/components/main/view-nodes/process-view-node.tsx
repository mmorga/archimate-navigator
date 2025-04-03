import { Bounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { CSSProperties, JSX } from "react";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return processPath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRoundedRectViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  }
}

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  const shaftTop = bounds.top + bounds.height * 0.15;
  const shaftBottom = bounds.bottom - bounds.height * 0.15;
  const left = bounds.left;
  const textBounds = new Bounds(
    left,
    shaftTop,
    bounds.width - bounds.height * 0.25,
    shaftBottom - shaftTop,
  );
  return textBounds.reducedBy(2);
}

function processPath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const top = bounds.top;
  const shaftTop = bounds.top + bounds.height * 0.15;
  const middle = bounds.top + bounds.height * 0.5;
  const shaftBottom = bounds.bottom - bounds.height * 0.15;
  const bottom = bounds.bottom;

  const left = bounds.left;
  const arrowBack = bounds.right - bounds.height * 0.5;
  const right = bounds.right;
  return (
    <path
      d={[
        "M",
        left,
        shaftTop,
        "L",
        arrowBack,
        shaftTop,
        "L",
        arrowBack,
        top,
        "L",
        right,
        middle,
        "L",
        arrowBack,
        bottom,
        "L",
        arrowBack,
        shaftBottom,
        "L",
        left,
        shaftBottom,
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}
