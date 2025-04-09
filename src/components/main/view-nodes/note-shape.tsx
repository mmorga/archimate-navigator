import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const NoteShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <path
      d={[
        "m",
        bounds.left,
        bounds.top,
        "h",
        bounds.width,
        "v",
        bounds.height - 8,
        "l",
        -8,
        8,
        "h",
        -(bounds.width - 8),
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={{
        fill: viewNode.style?.fillColor?.toRGBA(),
        stroke: viewNode.style?.lineColor?.toRGBA(),
        strokeWidth: viewNode.style?.lineWidth,
      }}
    />
  );
};

export default NoteShape;
