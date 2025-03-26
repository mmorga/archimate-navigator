import * as React from "react";
import { Bounds } from "../../archimate-model";

interface IProps {
  bounds: Bounds;
  selected: boolean;
}

const SelectedViewNode: React.FC<IProps> = (props) => {
  if (!props.selected) {
    return undefined;
  }
  const b = props.bounds;
  return (
    <rect
      className="archimate-selected-element-highlight"
      style={{ display: "inherit" }}
      x={b.x}
      y={b.y}
      width={b.width}
      height={b.height}
    />
  );
};

export default SelectedViewNode;
