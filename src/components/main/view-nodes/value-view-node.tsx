import * as React from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class ValueViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      textBounds: this.valueTextBounds(),
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.curBounds();
    const cx = bounds.left + bounds.width / 2.0;
    const rx = bounds.width / 2.0 - 1;
    const cy = bounds.top + bounds.height / 2.0;
    const ry = bounds.height / 2.0 - 1;
    return (
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={this.state.backgroundClass} style={this.shapeStyle()} />
    );
  }
  
  private valueTextBounds(): Bounds {
    const textBounds = this.state.textBounds;
    return new Bounds(
      textBounds.left + 10,
      textBounds.top + 10,
      textBounds.width - 20,
      textBounds.height - 20
    );
  }
}
