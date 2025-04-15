import { ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgPath, svgRect } from "./base-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const GroupingShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const groupHeaderHeight = 21;
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
      <path
        d={[
          "M",
          bounds.left,
          bounds.top + groupHeaderHeight - 1,
          "v",
          -(groupHeaderHeight - 1),
          "h",
          bounds.width / 2,
          "v",
          groupHeaderHeight - 1,
        ].join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
    </>
  );
};

export const enterGroupingShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  const groupHeaderHeight = 21;
  svgRect(
    g,
    bounds.left,
    bounds.top + groupHeaderHeight,
    bounds.width,
    bounds.height - groupHeaderHeight,
    backgroundClass,
    shapeStyle,
  );
  svgPath(
    g,
    [
      "M",
      bounds.left,
      bounds.top + groupHeaderHeight - 1,
      "v",
      -(groupHeaderHeight - 1),
      "h",
      bounds.width / 2,
      "v",
      groupHeaderHeight - 1,
    ],
    backgroundClass,
    shapeStyle,
  );
};

export default GroupingShape;
