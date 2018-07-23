import * as React from "react";
import { Bounds } from "../../../archimate-model";
import BadgedNodeViewNode from "./badged-node-view-node";
import { IViewNodeProps } from "./default-element";

export default class DeviceViewNode extends BadgedNodeViewNode {
  public static path(viewNodeBounds: Bounds, backgroundClass: string | undefined, style: React.CSSProperties): JSX.Element {
    const bounds = viewNodeBounds;
    const margin = 10;
    const decorationPath = [
      "M", bounds.left + margin, bounds.bottom - margin,
      "l", -margin, margin,
      "h", bounds.width,
      "l", -margin, -margin,
      "z"
    ].join(" ");
  
    return (
      <React.Fragment>
        <rect
          x={bounds.left}
          y={bounds.top}
          width={bounds.width}
          height={bounds.height - margin}
          rx={"6"}
          ry={"6"}
          className={backgroundClass}
          style={style}
        />
        <path d={decorationPath} className={backgroundClass} style={style} />
        <path d={decorationPath} className="archimate-decoration" style={style} />
      </React.Fragment> 
    );  
  }

  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badge: "#archimate-device-badge",
       };
    } else {
      this.state = {
        ...this.state,
        badge: undefined,
       };
    }
  }

  public entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return super.entityShape();
    } else {
      return DeviceViewNode.path(this.props.viewNode.bounds, this.state.backgroundClass, this.shapeStyle());
    }
  }
}
