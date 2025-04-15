import { ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgG, svgRect } from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ContractShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const margin = 8;
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
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
      <rect
        x={bounds.left}
        y={bounds.top + bounds.height - margin}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
    </g>
  );
};

export const enterContractShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  const margin = 8;
  svgRect(
    g,
    viewNode.x,
    viewNode.y,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
  );
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
    bounds.width,
    margin,
    "archimate-decoration",
  );
  svgRect(
    ag,
    bounds.left,
    bounds.top + bounds.height - margin,
    bounds.width,
    margin,
    "archimate-decoration",
  );
};

export default ContractShape;
