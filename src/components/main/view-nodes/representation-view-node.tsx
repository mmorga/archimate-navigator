import * as React from "react";
import DataObjectViewNode from "./data-object-view-node";
import { IViewNodeProps } from "./default-element";

export default class RepresentationViewNode extends DataObjectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.curBounds();
    return (
      <React.Fragment>
        <path
            d={[
                "M", bounds.left, bounds.top,
                "v", bounds.height - 8,
                "c", 0.167 * bounds.width, 0.133 * bounds.height,
                0.336 * bounds.width, 0.133 * bounds.height,
                bounds.width * 0.508, 0,
                "c", 0.0161 * bounds.width, -0.0778 * bounds.height,
                0.322 * bounds.width, -0.0778 * bounds.height,
                bounds.width * 0.475, 0,
                "v", -(bounds.height - 8),
                "z"
              ].join(" ")}
            className={this.state.backgroundClass}
            style={this.shapeStyle()}
        />
        <rect key="data-decoration" x={bounds.left} y={bounds.top} width={bounds.width} height={this.state.margin} className="archimate-decoration" />
      </React.Fragment>
    );
  }
}
