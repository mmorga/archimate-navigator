import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const ArtifactShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const margin = 18;
  return (
    <g className={backgroundClass} style={shapeStyle}>
      <path
        d={[
          "M",
          bounds.left,
          bounds.top,
          "h",
          bounds.width - margin,
          "l",
          margin,
          margin,
          "v",
          bounds.height - margin,
          "h",
          -bounds.width,
          "z",
        ].join(" ")}
      />
      <path
        d={[
          "M",
          bounds.right - margin,
          bounds.top,
          "v",
          margin,
          "h",
          margin,
          "z",
        ].join(" ")}
        className="archimate-decoration"
      />
    </g>
  );
};

export default ArtifactShape;
