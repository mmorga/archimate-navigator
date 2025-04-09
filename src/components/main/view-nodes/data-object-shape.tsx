import { Bounds, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
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

export function dataObjectTextBounds(viewNode: ViewNode): Bounds {
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
