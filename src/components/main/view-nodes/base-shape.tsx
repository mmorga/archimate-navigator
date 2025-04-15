import { Bounds, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import { cssPropertiesToString } from "./style-utils";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function defaultTextBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height).reducedBy(
    2,
  );
}

const BaseShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
  shapeStyle,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
};

export const enterBaseShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  svgRect(
    g,
    viewNode.x,
    viewNode.y,
    bounds.width,
    bounds.height,
    backgroundClass,
    shapeStyle,
  );
};

export function svgG(
  g: SVGGElement,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): SVGGElement {
  const child = document.createElementNS("http://www.w3.org/2000/svg", "g");
  if (backgroundClass) {
    child.setAttribute("class", backgroundClass);
  }
  if (shapeStyle) {
    child.setAttribute("style", cssPropertiesToString(shapeStyle));
  }
  g.appendChild(child);
  return child;
}

export function svgRect(
  g: SVGGElement,
  x: number | undefined,
  y: number | undefined,
  width: number,
  height: number,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
  rx?: number,
  ry?: number,
): void {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", (x || 0).toString());
  rect.setAttribute("y", (y || 0).toString());
  rect.setAttribute("width", width.toString());
  rect.setAttribute("height", height.toString());
  if (rx) {
    rect.setAttribute("rx", rx.toString());
  }
  if (ry) {
    rect.setAttribute("ry", ry.toString());
  }
  if (backgroundClass) {
    rect.setAttribute("class", backgroundClass);
  }
  if (shapeStyle) {
    rect.setAttribute("style", cssPropertiesToString(shapeStyle));
  }
  g.appendChild(rect);
}

export function svgPath(
  g: SVGGElement,
  d: (string | number)[],
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d.map((i) => i.toString()).join(" "));
  if (backgroundClass) {
    path.setAttribute("class", backgroundClass);
  }
  if (shapeStyle) {
    path.setAttribute("style", cssPropertiesToString(shapeStyle));
  }
  g.appendChild(path);
}

export function svgEllipse(
  g: SVGGElement,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  backgroundClass: string | undefined,
  shapeStyle?: CSSProperties | undefined,
): void {
  const ellipse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse",
  );
  ellipse.setAttribute("cx", cx.toString());
  ellipse.setAttribute("cy", cy.toString());
  ellipse.setAttribute("rx", rx.toString());
  ellipse.setAttribute("ry", ry.toString());
  if (backgroundClass) {
    ellipse.setAttribute("class", backgroundClass);
  }
  if (shapeStyle) {
    ellipse.setAttribute("style", cssPropertiesToString(shapeStyle));
  }
  g.appendChild(ellipse);
}

export default BaseShape;
