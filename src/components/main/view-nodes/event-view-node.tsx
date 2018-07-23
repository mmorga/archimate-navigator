import * as React from "react";
import { Bounds, zeroBounds } from "../../../archimate-model";
import BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { IViewNodeProps } from "./default-element";

export default class EventViewNode extends BadgedRoundedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badgeBounds: zeroBounds(),
        textBounds: this.eventTextBounds(),
      };
    } else {
      this.state = {
        ...this.state,
        badge: "#archimate-event-badge",
      };
    }
  }

  protected entityShape() {
    if (this.props.viewNode.childType === "1") {
      return this.eventPath();
    } else {
      return super.entityShape();
    }
  }

  private eventTextBounds(): Bounds {
    const textBounds = this.state.textBounds;
    const notchX = 18;
    return new Bounds(textBounds.left + notchX * 0.8, textBounds.top, textBounds.width - notchX, textBounds.height);
  }

  private eventPath(): JSX.Element {
    const bounds = this.props.viewNode.bounds;
    const notchX = 18;
    const notchHeight = bounds.height / 2.0;
    const eventWidth = bounds.width * 0.85;
    const rx = 17;
    const d = [
        "M", bounds.left, bounds.top,
        "l", notchX, notchHeight,
        "l", -notchX, notchHeight,
        "h", eventWidth,
        "a", rx, notchHeight, 0, 0, 0, 0, -bounds.height,
        "z"
      ].join(" ");
    return (
      <path d={ d } className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }
}
