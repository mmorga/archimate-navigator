import { Bounds, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { defaultTextBounds, svgRect } from "./base-shape";
import BadgedNodeShape, { enterBadgedNodeShape } from "./badged-node-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const NodeShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <NodePath
        bounds={viewNode.absolutePosition()}
        backgroundClass={backgroundClass}
        style={shapeStyle}
      />
    );
  } else {
    return (
      <BadgedNodeShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  }
};

export const enterNodeShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  if (viewNode.childType === "1") {
    enterNodePath(g, viewNode, backgroundClass, shapeStyle);
  } else {
    enterBadgedNodeShape(g, viewNode, backgroundClass, shapeStyle);
  }
};

function NodePath({
  bounds,
  backgroundClass,
  style,
}: {
  bounds: Bounds;
  backgroundClass: string | undefined;
  style: CSSProperties | undefined;
}) {
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={style}
    />
  );
}

function enterNodePath(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const bounds = viewNode.absolutePosition();
  svgRect(
    g,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
  );
}

export function nodeTextBounds(viewNode: ViewNode): Bounds {
  const textBounds = defaultTextBounds(viewNode);
  const margin: number = 14;
  return new Bounds(
    textBounds.left,
    textBounds.top + margin,
    textBounds.width,
    textBounds.height - margin,
  );
}

export default NodeShape;
