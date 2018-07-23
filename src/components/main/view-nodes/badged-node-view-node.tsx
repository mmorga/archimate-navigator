import * as React from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class BadgedNodeViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badgeBounds: this.nodeBadgeBounds(),
      margin: 14,
      textBounds: this.nodeTextBounds(),
    };
  }

  protected entityShape(): JSX.Element {
    const bounds = this.props.viewNode.bounds;
    const margin = this.state.margin || 14;
    const nodeBoxHeight = bounds.height - margin;
    const nodeBoxWidth = bounds.width - margin;
    return (
      <g className={this.state.backgroundClass} style={this.shapeStyle()}>
        <path 
          d={[
              "M", bounds.left, bounds.bottom,
              "v", -nodeBoxHeight,
              "l", margin, -margin,
              "h", nodeBoxWidth,
              "v", nodeBoxHeight,
              "l", -margin, margin,
              "z"
            ].join(" ")}
        />
        <path 
          d={[
              "M", bounds.left, bounds.top + margin,
              "l", margin, -margin,
              "h", nodeBoxWidth,
              "v", nodeBoxHeight,
              "l", -margin, margin,
              "v", -nodeBoxHeight,
              "z",
              "M", bounds.right, bounds.top,
              "l", -margin, margin
            ].join(" ")}
          className="archimate-decoration"
        />
        <path 
          d={[
              "M", bounds.left, bounds.top + margin,
              "h", nodeBoxWidth,
              "l", margin, -margin,
              "M", bounds.left + nodeBoxWidth, bounds.bottom,
              "v", -nodeBoxHeight
            ].join(" ")}
          style={{fill:"none",stroke:"inherit"}}
        />
      </g>
    );
  }

  private nodeBadgeBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    const margin = 14;
    return new Bounds(
      bounds.right - margin - 25,
      bounds.top + margin + 5,
      20,
      20
    );
  }

  private nodeTextBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    const margin = 14;
    const nodeBoxHeight = bounds.height - margin;
    const nodeBoxWidth = bounds.width - margin;
    return new Bounds(bounds.left + 1, bounds.top + margin + 1, nodeBoxWidth - 2, nodeBoxHeight - 2);
  }
}
