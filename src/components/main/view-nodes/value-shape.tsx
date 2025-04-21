import { svgEllipse } from "./base-shape";
import { Bounds, IViewNode, ViewNode } from "../../../archimate-model";
import type {
  EntityShapeComponent,
  IEntityShapeProps,
} from "./entity-shape-component";

export function valueTextBounds(viewNode: IViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 10,
    bounds.top + 10,
    bounds.width - 20,
    bounds.height - 20,
  );
}

const ValueShape: EntityShapeComponent = ({
  viewNode,
  backgroundClass,
}: IEntityShapeProps) => {
  const bounds = viewNode.absolutePosition();
  const cx = bounds.left + bounds.width / 2.0;
  const rx = bounds.width / 2.0 - 1;
  const cy = bounds.top + bounds.height / 2.0;
  const ry = bounds.height / 2.0 - 1;
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      className={backgroundClass}
      style={{
        fill: viewNode.style?.fillColor?.toRGBA(),
        stroke: viewNode.style?.lineColor?.toRGBA(),
        strokeWidth: viewNode.style?.lineWidth,
      }}
    />
  );
};

export const enterValueShape = (
  g: SVGGElement,
  viewNode: ViewNode,
  backgroundClass: string | undefined,
): void => {
  const bounds = viewNode.absolutePosition();
  const cx = bounds.left + bounds.width / 2.0;
  const rx = bounds.width / 2.0 - 1;
  const cy = bounds.top + bounds.height / 2.0;
  const ry = bounds.height / 2.0 - 1;
  svgEllipse(g, cx, cy, rx, ry, backgroundClass, {
    fill: viewNode.style?.fillColor?.toRGBA(),
    stroke: viewNode.style?.lineColor?.toRGBA(),
    strokeWidth: viewNode.style?.lineWidth,
  });
};

export default ValueShape;
