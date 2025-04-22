import { Bounds } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const RepresentationShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const margin = 8;
  return (
    <>
      <path
        d={representationPathD(bounds).join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        key="data-decoration"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
    </>
  );
};

function representationPathD(bounds: Bounds) {
  return [
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
  ];
}

export default RepresentationShape;
