import * as React from "react";
import { Bounds, zeroBounds } from "../../../archimate-model";
import BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { IViewNodeProps } from "./default-element";

export default class ProcessViewNode extends BadgedRoundedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badgeBounds: zeroBounds(),
        textBounds: this.processTextBounds(),
      };
    } else {
      this.state = {
        ...this.state,
        badge: "#archimate-process-badge",
      };
    }
  }

  protected entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return this.processPath();
    } else {
      return super.entityShape();
    }
  }

  private processTextBounds(): Bounds {
    const bounds = this.props.viewNode.bounds;
    const shaftTop = bounds.top + bounds.height * 0.15;
    const shaftBottom = bounds.bottom - bounds.height * 0.15;
    const left = bounds.left;
    const textBounds = new Bounds(left, shaftTop, bounds.width - bounds.height * 0.25, shaftBottom - shaftTop);
    return textBounds.reducedBy(2);
  }

  private processPath(): JSX.Element {
    const bounds = this.props.viewNode.bounds;
    const top = bounds.top;
    const shaftTop = bounds.top + bounds.height * 0.15;
    const middle = bounds.top + bounds.height * 0.5;
    const shaftBottom = bounds.bottom - bounds.height * 0.15;
    const bottom = bounds.bottom;

    const left = bounds.left;
    const arrowBack = bounds.right - bounds.height * 0.5;
    const right = bounds.right;
    return (
      <path
        d={[
          "M", left, shaftTop,
          "L", arrowBack, shaftTop,
          "L", arrowBack, top,
          "L", right, middle,
          "L", arrowBack, bottom,
          "L", arrowBack, shaftBottom,
          "L", left, shaftBottom,
          "z"
        ].join(" ")}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
        />
    );
  }
}
