import { Bounds, IViewNode } from "@/archimate-model";
import { CSSProperties } from "react";
import { svgRect } from "./base-shape";
import { ViewNode } from "@/archimate-model";
import BadgedRoundedRectShape, {
  enterBadgedRoundedRectShape,
} from "./badged-rounded-rect-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ServiceShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <ServicePath
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

export function enterServiceShape(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  if (viewNode.childType === "1") {
    enterServicePath(g, viewNode, backgroundClass, shapeStyle);
  } else {
    enterBadgedRoundedRectShape(g, viewNode, backgroundClass, shapeStyle);
  }
}

export function serviceTextBounds(viewNode: IViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 7,
    bounds.top + 5,
    bounds.width - 14,
    bounds.height - 10,
  );
}

const ServicePath: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.left}
      y={bounds.top}
      width={bounds.width}
      height={bounds.height}
      rx={bounds.height / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export function enterServicePath(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const bounds = viewNode.absolutePosition();
  svgRect(
    g,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
    bounds.height / 2.0,
    bounds.height / 2.0,
  );
}

export default ServiceShape;
