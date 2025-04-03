import { Bounds } from "@/archimate-model";
import { CSSProperties, JSX } from "react";
import { ViewNode } from "@/archimate-model";
import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import * as BaseViewNode from "./base-view-node";

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return eventPath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRoundedRectViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  }
}

export function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  if (viewNode.childType === "1") {
    return undefined;
  } else {
    return BadgedRoundedRectViewNode.badgeBounds(viewNode);
  }
}

export function textBounds(viewNode: ViewNode): Bounds {
  if (viewNode.childType === "1") {
    const textBounds = BaseViewNode.textBounds(viewNode);
    const notchX = 18;
    return new Bounds(
      textBounds.left + notchX * 0.8,
      textBounds.top,
      textBounds.width - notchX,
      textBounds.height,
    );
  } else {
    return BaseViewNode.textBounds(viewNode);
  }
}

function eventPath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const notchX = 18;
  const notchHeight = bounds.height / 2.0;
  const eventWidth = bounds.width * 0.85;
  const rx = 17;
  const d = [
    "M",
    bounds.left,
    bounds.top,
    "l",
    notchX,
    notchHeight,
    "l",
    -notchX,
    notchHeight,
    "h",
    eventWidth,
    "a",
    rx,
    notchHeight,
    0,
    0,
    0,
    0,
    -bounds.height,
    "z",
  ].join(" ");
  return <path d={d} className={backgroundClass} style={shapeStyle} />;
}
