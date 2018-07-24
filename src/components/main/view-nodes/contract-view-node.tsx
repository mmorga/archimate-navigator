import * as React from "react";
import DataObjectViewNode from "./data-object-view-node";
import { IViewNodeProps } from "./default-element";

export default class ContractViewNode extends DataObjectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      margin: 8,
};
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.curBounds();
    const margin = this.state.margin || 8;
    return (
      <g className={this.state.backgroundClass}>
        <rect x={bounds.left} y={bounds.top} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect x={bounds.left} y={bounds.top} width={bounds.width} height={margin}  className="archimate-decoration" />
        <rect x={bounds.left} y={bounds.top + bounds.height - margin} width={bounds.width} height={margin} className="archimate-decoration" />
      </g>
    );
  }
}
