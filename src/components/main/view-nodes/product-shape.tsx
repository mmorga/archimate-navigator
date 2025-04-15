import { CSSProperties } from "react";
import { svgG, svgRect } from "./base-shape";
import { ViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ProductShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <g className={backgroundClass}>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height="8"
        className="archimate-decoration"
      />
    </g>
  );
};

export const enterProductShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  const ag = svgG(g, backgroundClass);
  svgRect(
    ag,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
  );
  svgRect(
    ag,
    bounds.left,
    bounds.top,
    bounds.width / 2.0,
    8,
    "archimate-decoration",
  );
};

export default ProductShape;
