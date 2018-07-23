import * as React from "react";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class JunctionViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {...this.state, backgroundClass: "archimate-junction-background"};
  }

  protected entityLabel() {
    return undefined;
  }

  protected entityShape() {
    const bounds = this.props.viewNode.bounds;
    const center = bounds.center();
    const r = Math.min(bounds.width, bounds.height) / 2;
    return (
      <circle cx={center.x} cy={center.y} r={r} className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }
}
