import { Bounds, IViewNode, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgRect } from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function badgedRectBadgeBounds(viewNode: IViewNode): Bounds | undefined {
  const absolutePosition = viewNode.absolutePosition();
  return new Bounds(
    absolutePosition.right - 25,
    absolutePosition.top + 5,
    20,
    20,
  );
}

const BadgedRectShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export const enterBadgedRectShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  svgRect(
    g,
    viewNode.x,
    viewNode.y,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
  );
};

export default BadgedRectShape;
