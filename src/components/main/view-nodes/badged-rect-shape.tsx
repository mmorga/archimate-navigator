import { Bounds, IViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function badgedRectBadgeBounds(viewNode: IViewNode): Bounds | undefined {
  const absolutePosition = viewNode.absolutePosition();
  return new Bounds(
    absolutePosition.right - 25,
    absolutePosition.top + 5,
    20,
    20,
  );
}

const BadgedRectShape: EntityShapeComponent = ({
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

export default BadgedRectShape;
