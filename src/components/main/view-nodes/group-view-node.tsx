import * as React from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class GroupViewNode extends DefaultViewNode {
  private groupHeaderHeight = 21;

  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-group-background",
      textAlign: "left",      
      textBounds: this.groupTextBounds(),
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.curBounds();
    return (
      <React.Fragment>
        <rect
            x={bounds.left}
            y={bounds.top + this.groupHeaderHeight}
            width={bounds.width}
            height={bounds.height - this.groupHeaderHeight}
            className={this.state.backgroundClass}
            style={this.shapeStyle()}
        />
        <rect 
            x={bounds.left}
            y={bounds.top}
            width={bounds.width / 2.0}
            height={this.groupHeaderHeight}
            className={this.state.backgroundClass}
            style={this.shapeStyle()}
        />
        <rect 
            x={bounds.left}
            y={bounds.top}
            width={bounds.width / 2.0}
            height={this.groupHeaderHeight}
            className={"archimate-decoration"}
        />)
      </React.Fragment>
    );
  }

  private groupTextBounds(): Bounds {
    const bounds = this.props.viewNode.curBounds();
    return new Bounds(bounds.left + 3, bounds.top, (bounds.width / 2.0) - 6, this.groupHeaderHeight);
  }
}
