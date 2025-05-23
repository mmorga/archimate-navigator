import { Bounds, IViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { defaultTextBounds } from "./base-shape";
import BadgedNodeShape from "./badged-node-shape";
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

export function nodeTextBounds(viewNode: IViewNode): Bounds {
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
