import { Bounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import { CSSProperties } from "react";
import { svgPath } from "./base-shape";
import BadgedRoundedRectShape, {
  enterBadgedRoundedRectShape,
} from "./badged-rounded-rect-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ProcessShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <ProcessPath
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  } else {
    return (
      <BadgedRoundedRectShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  }
};

export function enterProcessShape(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  if (viewNode.childType === "1") {
    enterProcessPath(g, viewNode, backgroundClass, shapeStyle);
  } else {
    enterBadgedRoundedRectShape(g, viewNode, backgroundClass, shapeStyle);
  }
}

export function processTextBounds(viewNode: ViewNode): Bounds {
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

const ProcessPath: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
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
};

export function enterProcessPath(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const bounds = viewNode.absolutePosition();
  const top = bounds.top;
  const shaftTop = bounds.top + bounds.height * 0.15;
  const middle = bounds.top + bounds.height * 0.5;
  const shaftBottom = bounds.bottom - bounds.height * 0.15;
  const bottom = bounds.bottom;

  const left = bounds.left;
  const arrowBack = bounds.right - bounds.height * 0.5;
  const right = bounds.right;
  svgPath(
    g,
    [
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
    ],
    backgroundClass,
    shapeStyle,
  );
}

export default ProcessShape;
