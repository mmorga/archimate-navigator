import { Bounds } from "../../../archimate-model";
import { CSSProperties } from "react";
import BadgedNodeShape from "./badged-node-shape";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

function DeviceShapePath({
  viewNodeBounds,
  backgroundClass,
  style,
}: {
  viewNodeBounds: Bounds;
  backgroundClass: string | undefined;
  style: CSSProperties | undefined;
}) {
  const bounds = viewNodeBounds;
  const margin = 10;
  const decorationPath = [
    "M",
    bounds.left + margin,
    bounds.bottom - margin,
    "l",
    -margin,
    margin,
    "h",
    bounds.width,
    "l",
    -margin,
    -margin,
    "z",
  ].join(" ");

  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height - margin}
        rx={"6"}
        ry={"6"}
        className={backgroundClass}
        style={style}
      />
      <path d={decorationPath} className={backgroundClass} style={style} />
      <path d={decorationPath} className="archimate-decoration" style={style} />
    </>
  );
}

const DeviceShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  if (viewNode.childType === "1") {
    return (
      <BadgedNodeShape
        viewNode={viewNode}
        backgroundClass={backgroundClass}
        shapeStyle={shapeStyle}
      />
    );
  } else {
    return (
      <DeviceShapePath
        viewNodeBounds={viewNode.absolutePosition()}
        backgroundClass={backgroundClass}
        style={shapeStyle}
      />
    );
  }
};

export default DeviceShape;
