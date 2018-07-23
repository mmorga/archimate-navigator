import * as React from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class BadgedRectViewNode extends DefaultViewNode {
  public static path(bounds: Bounds, backgroundClass: string | undefined, style: React.CSSProperties): JSX.Element {
    return (
      <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} className={backgroundClass} style={style}/>
    );
  }

  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badgeBounds: new Bounds(this.props.viewNode.bounds.right - 25, this.props.viewNode.bounds.top + 5, 20, 20),
    };
  }

  protected entityShape() {
    const bounds = this.props.viewNode.bounds;
    return (
      <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} className={this.state.backgroundClass} style={this.shapeStyle()}/>
    );
  }
}
