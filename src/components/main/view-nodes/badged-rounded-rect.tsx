import * as React from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class BadgedRoundedRectViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badgeBounds: this.roundedRectBadgeBounds(),
    };
  }

  protected entityShape() {
    const bounds = this.props.viewNode.bounds;
    return (
      <rect x={bounds.left()} y={bounds.top()} width={bounds.width} height={bounds.height} rx={"5"} ry={"5"} className={this.state.backgroundClass} />
    );
  }

  private roundedRectBadgeBounds() {
    const bounds = this.props.viewNode.bounds;
    return new Bounds(
      bounds.right() - 25,
      bounds.top() + 5,
      20,
      20
    );
  }
}
