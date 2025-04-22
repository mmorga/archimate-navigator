import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const BadgedRoundedRectShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.left}
      y={bounds.top}
      width={bounds.width}
      height={bounds.height}
      rx={"5"}
      ry={"5"}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export default BadgedRoundedRectShape;
