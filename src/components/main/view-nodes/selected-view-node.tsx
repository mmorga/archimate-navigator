import { Bounds } from "../../../archimate-model";
import { svgRect } from "./base-shape";

type IProps = {
  bounds: Bounds;
  selected: boolean;
};

const SelectedViewNode = ({ bounds, selected }: IProps) => {
  if (!selected) {
    return undefined;
  }
  return (
    <rect
      className="archimate-selected-element-highlight"
      style={{ display: "inherit" }}
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
    />
  );
};

export const enterSelectedViewNode = (g: SVGGElement, bounds: Bounds): void => {
  svgRect(
    g,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    undefined,
    undefined,
  );
};

export default SelectedViewNode;
