import { JSX } from "react";
import { Bounds } from "../../../archimate-model";
import BadgedNodeViewNode from "./badged-node-view-node";
import { IViewNodeProps } from "./default-element";

export default class DeviceViewNode extends BadgedNodeViewNode {
  public static path(
    viewNodeBounds: Bounds,
    backgroundClass: string | undefined,
    style: React.CSSProperties
  ): JSX.Element {
    const bounds = viewNodeBounds;
    const margin = 10;
    const decorationPath = [
      "M",
      bounds.left + margin,
      bounds.bottom - margin,
      "l",
      -margin,
      margin,
      "h",
      bounds.width,
      "l",
      -margin,
      -margin,
      "z"
    ].join(" ");

    return (
      <>
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
        <path
          d={decorationPath}
          className="archimate-decoration"
          style={style}
        />
      </>
    );
  }

  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badge: "#archimate-device-badge"
      };
    } else {
      this.state = {
        ...this.state,
        badge: undefined,
        badgeBounds: undefined,
        textBounds: this.props.viewNode.absolutePosition().reducedBy(2)
      };
    }
  }

  public entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return super.entityShape();
    } else {
      return DeviceViewNode.path(
        this.props.viewNode.absolutePosition(),
        this.state.backgroundClass,
        this.shapeStyle()
      );
    }
  }
}
