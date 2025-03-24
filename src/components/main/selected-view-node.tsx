import * as React from "react";
import { Bounds } from "../../archimate-model";

interface IProps {
  bounds: Bounds;
}

const SelectedViewNode: React.FC<IProps> = (props) => {
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
