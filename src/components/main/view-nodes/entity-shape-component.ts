import { ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";

export type IEntityShapeProps = {
  viewNode: ViewNode;
  backgroundClass: string | undefined;
  shapeStyle?: CSSProperties | undefined;
};

export type EntityShapeComponent = React.FC<IEntityShapeProps>;
export type EnterEntityShapeFunc = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
) => void;
