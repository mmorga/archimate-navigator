import { ViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

const NoteShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
}: IEntityShapeProps) => {
  return (
    <path
      d={nodePathD(viewNode).join(" ")}
      className={backgroundClass}
      style={{
        fill: viewNode.style?.fillColor?.toRGBA(),
        stroke: viewNode.style?.lineColor?.toRGBA(),
        strokeWidth: viewNode.style?.lineWidth,
      }}
    />
  );
};

function nodePathD(viewNode: ViewNode): (string | number)[] {
  const bounds = viewNode.absolutePosition();
  return [
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
  ];
}

export default NoteShape;
