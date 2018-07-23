import * as React from "react";
import DataObjectViewNode from "./data-object-view-node";
import { IViewNodeProps } from "./default-element";

export default class ProductViewNode extends DataObjectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.bounds;
    return (
      <g className={this.state.backgroundClass}>
        <rect x={bounds.left} y={bounds.top} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect x={bounds.left} y={bounds.top} width={bounds.width / 2.0} height="8" className="archimate-decoration" />
      </g>
    );
  }
}
