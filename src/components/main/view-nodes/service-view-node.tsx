import * as React from "react";
import { Bounds, zeroBounds } from "../../../archimate-model";
import BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { IViewNodeProps } from "./default-element";

export default class ServiceViewNode extends BadgedRoundedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badgeBounds: zeroBounds(),
        textBounds: this.textBounds()
      };
    } else {
      this.state = {
        ...this.state,
        badge: "#archimate-service-badge"
      };
    }
  }

  protected entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return this.servicePath();
    } else {
      return super.entityShape();
    }
  }

  protected textBounds(): Bounds {
    const bounds = this.props.viewNode.absolutePosition();
    return new Bounds(
      bounds.left + 7,
      bounds.top + 5,
      bounds.width - 14,
      bounds.height - 10
    );
  }

  private servicePath(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    return (
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        rx={bounds.height / 2.0}
        ry={bounds.height / 2.0}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }
}
