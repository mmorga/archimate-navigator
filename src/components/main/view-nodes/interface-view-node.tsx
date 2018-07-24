import * as React from "react";
import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class InterfaceViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badge: undefined,
        badgeBounds: undefined,
      };
    } else {
      this.state = {
        ...this.state,
        badge: "#archimate-interface-badge",
      };
    }
  }

  protected entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return this.elipsePath();
    } else {
      return super.entityShape();
    }
  }

  private elipsePath(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    return (
      <ellipse
        cx={bounds.left + bounds.width / 2.0}
        cy={bounds.top + bounds.height / 2.0}
        rx={bounds.width / 2.0}
        ry={bounds.height / 2.0}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }
}
