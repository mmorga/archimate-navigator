import { Bounds } from "../../../archimate-model";

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

export default SelectedViewNode;
