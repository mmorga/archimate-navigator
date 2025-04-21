import { Bounds, IViewNode, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgG, svgRect } from "./base-shape";
import * as BaseViewNode from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const DataObjectShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const style = shapeStyle;
  const margin = 8;
  const decorStyle: CSSProperties = {
    stroke: style?.stroke,
    strokeWidth: style?.strokeWidth,
  };
  return (
    <g className={backgroundClass}>
      <rect
        key="data-background"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={style}
      />
      <rect
        key="data-decoration"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
        style={decorStyle}
      />
    </g>
  );
};

export function enterDataObjectShape(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const bounds = viewNode.absolutePosition();
  const style = shapeStyle;
  const margin = 8;
  const decorStyle: CSSProperties = {
    stroke: style?.stroke,
    strokeWidth: style?.strokeWidth,
  };
  const ag = svgG(g, backgroundClass);
  svgRect(
    ag,
    // key="data-background"
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    backgroundClass,
    style,
  );

  svgRect(
    ag,
    // key="data-decoration"
    bounds.left,
    bounds.top,
    bounds.width,
    margin,
    "archimate-decoration",
    decorStyle,
  );
}

export function dataObjectTextBounds(viewNode: IViewNode): Bounds {
  const textBounds = BaseViewNode.defaultTextBounds(viewNode);
  const margin: number = 8;
  return new Bounds(
    textBounds.left,
    textBounds.top + margin,
    textBounds.width,
    textBounds.height - margin,
  );
}

export default DataObjectShape;
