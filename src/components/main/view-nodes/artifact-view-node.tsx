import * as React from "react";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class ArtifactViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "archimate-artifact-badge",
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.curBounds();
    const margin = 18;
    return (
      <g className={this.state.backgroundClass} style={this.shapeStyle()}>
        <path 
          d={[
              "M", bounds.left, bounds.top,
              "h", bounds.width - margin,
              "l", margin, margin,
              "v", bounds.height - margin,
              "h", -bounds.width,
              "z"
            ].join(" ")}
        />
        <path 
          d={[
              "M", bounds.right - margin, bounds.top,
              "v", margin,
              "h", margin,
              "z"
            ].join(" ")}
          className="archimate-decoration"
        />
      </g>
    );
  }
}
