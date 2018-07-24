import * as React from "react";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class DeliverableViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "archimate-artifact-badge",
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
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
      </React.Fragment>
    );
  }
}
