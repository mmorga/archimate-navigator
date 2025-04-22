import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const JunctionShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const center = bounds.center();
  const r = Math.min(bounds.width, bounds.height) / 2;
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={r}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export default JunctionShape;
