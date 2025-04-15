import BadgedRectShape, { enterBadgedRectShape } from "./badged-rect-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";
import { ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { svgEllipse } from "./base-shape";

const ElipsePath: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <ellipse
      cx={bounds.left + bounds.width / 2.0}
      cy={bounds.top + bounds.height / 2.0}
      rx={bounds.width / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export const enterEllipsePath = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  svgEllipse(
    g,
    bounds.left + bounds.width / 2.0,
    bounds.top + bounds.height / 2.0,
    bounds.width / 2.0,
    bounds.height / 2.0,
    backgroundClass,
    shapeStyle,
  );
};

const InterfaceShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <ElipsePath
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  } else {
    return (
      <BadgedRectShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  }
};

export const enterInterfaceShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  if (viewNode.childType === "1") {
    enterEllipsePath(g, viewNode, backgroundClass, shapeStyle);
  } else {
    enterBadgedRectShape(g, viewNode, backgroundClass, shapeStyle);
  }
};

export default InterfaceShape;
