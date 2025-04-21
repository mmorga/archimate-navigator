import { CSSProperties } from "react";
import { svgRect } from "./base-shape";
import { ViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const BadgedRoundedRectShape: EntityShapeComponent = ({
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
      rx={"5"}
      ry={"5"}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export const enterBadgedRoundedRectShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();

  svgRect(
    g,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
    5,
    5,
  );
};

export const updateBadgedRoundedRectShape = (
  selection: d3.Selection<SVGGElement, ViewNode, SVGGElement, undefined>,
  vn: ViewNode,
) => {
  const bounds = vn.absolutePosition();
  selection
    .select(".g-archimate-shape rect")
    .attr("x", bounds.left)
    .attr("y", bounds.top);
};

export default BadgedRoundedRectShape;
