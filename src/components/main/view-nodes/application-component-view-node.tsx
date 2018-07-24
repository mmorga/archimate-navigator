import * as React from "react";
import { Bounds } from "../../../archimate-model";
import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class ApplicationComponentViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);

    const badge = (this.props.viewNode.childType === "1") ? "#archimate-app-component-badge" : undefined;
    this.state = {
      ...this.state,
      badge,
      badgeBounds: undefined,
      textBounds: this.textBounds(),
    };
}

  protected badgeBounds(): Bounds | undefined {
    if (this.props.viewNode.childType === "1") {
      return super.badgeBounds();
    } else {
      return undefined;
    }
  }

  protected textBounds(): Bounds {
    if (this.props.viewNode.childType === "1") {
      return super.textBounds();
    } else {
      const bounds = this.props.viewNode.curBounds();
      const mainBoxX = bounds.left + 21.0 / 2;
      return new Bounds(mainBoxX + 21 / 2, bounds.top + 1, bounds.width - 22, bounds.height - 2);
    }
  }
  
  
  protected entityShape() {
    if (this.props.viewNode.childType === "1") {
      return super.entityShape();
    } else {
      const bounds = this.props.viewNode.curBounds();
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


