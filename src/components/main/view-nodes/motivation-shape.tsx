import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const MotivationShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const margin = 10;
  const width = bounds.width - margin * 2;
  const height = bounds.height - margin * 2;
  return (
    <path
      d={[
        "M",
        bounds.left + margin,
        bounds.top,
        "h",
        width,
        "l",
        margin,
        margin,
        "v",
        height,
        "l",
        -margin,
        margin,
        "h",
        -width,
        "l",
        -margin,
        -margin,
        "v",
        -height,
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export default MotivationShape;
