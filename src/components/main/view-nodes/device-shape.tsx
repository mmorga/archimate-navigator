import { Bounds, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import BadgedNodeShape, { enterBadgedNodeShape } from "./badged-node-shape";
import { svgPath, svgRect } from "./base-shape";
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

function enterDeviceShapePath(
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const bounds = viewNode.absolutePosition();
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
  ];

  svgRect(
    g,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height - margin,
    backgroundClass,
    shapeStyle,
    6,
    6,
  );
  svgPath(
    g,
    decorationPath,
    `${backgroundClass} archimate-decoration`,
    shapeStyle,
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

export const enterDeviceShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  if (viewNode.childType === "1") {
    enterBadgedNodeShape(g, viewNode, backgroundClass, shapeStyle);
  } else {
    enterDeviceShapePath(g, viewNode, backgroundClass, shapeStyle);
  }
};

export default DeviceShape;
