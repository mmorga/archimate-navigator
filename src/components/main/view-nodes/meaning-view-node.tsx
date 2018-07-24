import * as React from "react";
import { Point } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class MeaningViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    const pts = [
      new Point(bounds.left + bounds.width * 0.04, bounds.top + bounds.height * 0.5),
      new Point(bounds.left + bounds.width * 0.5, bounds.top + bounds.height * 0.12),
      new Point(bounds.left + bounds.width * 0.94, bounds.top + bounds.height * 0.55),
      new Point(bounds.left + bounds.width * 0.53, bounds.top + bounds.height * 0.87)
    ];
    return (
      <path
        d={[
        "M", pts[0].x, pts[0].y,
        "C", pts[0].x - bounds.width * 0.15, pts[0].y - bounds.height * 0.32,
        pts[1].x - bounds.width * 0.3, pts[1].y - bounds.height * 0.15,
        pts[1].x, pts[1].y,
        "C", pts[1].x + bounds.width * 0.29, pts[1].y - bounds.height * 0.184,
        pts[2].x + bounds.width * 0.204, pts[2].y - bounds.height * 0.304,
        pts[2].x, pts[2].y,
        "C", pts[2].x + bounds.width * 0.028, pts[2].y + bounds.height * 0.295,
        pts[3].x + bounds.width * 0.156, pts[3].y + bounds.height * 0.088,
        pts[3].x, pts[3].y,
        "C", pts[3].x - bounds.width * 0.279, pts[3].y + bounds.height * 0.326,
        pts[0].x - bounds.width * 0.164, pts[0].y + bounds.height * 0.314,
        pts[0].x, pts[0].y
      ].join(" ")}
      className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }
}
