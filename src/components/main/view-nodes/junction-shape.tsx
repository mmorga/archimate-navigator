import { CSSProperties } from "react";
import { cssPropertiesToString } from "./style-utils";
import { ViewNode } from "../../../archimate-model";
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

export const enterJunctionShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  const center = bounds.center();
  const r = Math.min(bounds.width, bounds.height) / 2;
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("cx", center.x.toString());
  circle.setAttribute("cy", center.y.toString());
  circle.setAttribute("r", r.toString());
  if (backgroundClass) {
    circle.setAttribute("class", backgroundClass);
  }
  if (shapeStyle) {
    circle.setAttribute("style", cssPropertiesToString(shapeStyle));
  }
  g.appendChild(circle);
};

export default JunctionShape;
