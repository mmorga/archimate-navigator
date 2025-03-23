import { PureComponent } from "react";
import { Bounds } from "../../archimate-model";

interface IProps {
  bounds: Bounds;
}

export default class SelectedViewNode extends PureComponent<IProps> {
  public render() {
    const b = this.props.bounds;
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
  }
}
