import * as React from "react";
import { Bounds, zeroBounds } from "../../../archimate-model";
import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class ApplicationComponentViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);

    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badge: "#archimate-app-component-badge",
      };
    } else {
      this.state = {
        ...this.state,
        badgeBounds: zeroBounds(),
        textBounds: componentTextBounds(this.props.viewNode.bounds),
      };
    }
  }

  protected entityShape() {
    if (this.props.viewNode.childType === "1") {
      return super.entityShape();
    } else {
      const bounds = this.props.viewNode.bounds;
      const mainBoxX = bounds.left + 21.0 / 2;
      const mainBoxWidth = bounds.width - 21 / 2;
      return (
        <React.Fragment>
          <rect x={mainBoxX} y={bounds.top} width={mainBoxWidth} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()} />
          {this.componentDecoration(bounds.left, bounds.top + 10)}
          {this.componentDecoration(bounds.left, bounds.top + 30)}
        </React.Fragment>
      );
    }
  }

  private componentDecoration(left: number, top: number) {
    return (
      <React.Fragment>
        <rect x={left} y={top} width="21" height="13" className={this.state.backgroundClass} style={this.shapeStyle()} />
        <rect x={left} y={top} width="21" height="13" className="archimate-decoration" />
      </React.Fragment>
    );
  }
}

function componentTextBounds(bounds: Bounds): Bounds {
  const mainBoxX = bounds.left + 21.0 / 2;
  return new Bounds(mainBoxX + 21 / 2, bounds.top + 1, bounds.width - 22, bounds.height - 2);
}



