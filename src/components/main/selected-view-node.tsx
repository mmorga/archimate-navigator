import * as React from "react";
import { Bounds } from "../../archimate-model/archimate/bounds";

interface IProps {
  bounds: Bounds;
}

export default class SelectedViewNode extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const b = this.props.bounds;
    return (
      <rect 
        className="archimate-selected-element-highlight"
        style={{display:"inherit"}}
        x={b.x}
        y={b.y}
        width={b.width}
        height={b.height}
      />
    );
  }
}
