import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const DeliverableShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <>
      <path
        d={[
          "M",
          bounds.left,
          bounds.top,
          "v",
          bounds.height - 8,
          "c",
          0.167 * bounds.width,
          0.133 * bounds.height,
          0.336 * bounds.width,
          0.133 * bounds.height,
          bounds.width * 0.508,
          0,
          "c",
          0.0161 * bounds.width,
          -0.0778 * bounds.height,
          0.322 * bounds.width,
          -0.0778 * bounds.height,
          bounds.width * 0.475,
          0,
          "v",
          -(bounds.height - 8),
          "z",
        ].join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
    </>
  );
};

export default DeliverableShape;
