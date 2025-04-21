import { Bounds, IViewNode, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgRect } from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const groupHeaderHeight = 21;

const GroupShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top + groupHeaderHeight}
        width={bounds.width}
        height={bounds.height - groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={"archimate-decoration"}
      />
      )
    </>
  );
};

export const enterGroupShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  svgRect(
    g,
    bounds.left,
    bounds.top + groupHeaderHeight,
    bounds.width,
    bounds.height - groupHeaderHeight,
    backgroundClass,
    shapeStyle,
  );
  svgRect(
    g,
    bounds.left,
    bounds.top,
    bounds.width / 2.0,
    groupHeaderHeight,
    backgroundClass,
    shapeStyle,
  );
  svgRect(
    g,
    bounds.left,
    bounds.top,
    bounds.width / 2.0,
    groupHeaderHeight,
    "archimate-decoration",
  );
};

export function groupTextBounds(viewNode: IViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 3,
    bounds.top,
    bounds.width / 2.0 - 6,
    groupHeaderHeight,
  );
}

export default GroupShape;
