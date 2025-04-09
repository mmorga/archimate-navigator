import { Bounds, ViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function defaultTextBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height).reducedBy(
    2,
  );
}

const BaseShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export default BaseShape;
