import { JSX } from "react";
import { IViewNodeProps } from "./default-element";
import GroupViewNode from "./group-view-node";

export default class GroupingViewNode extends GroupViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-grouping-background",
      textAlign: "left"
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    const groupHeaderHeight = 21;
    return (
      <>
        <rect
          x={bounds.left}
          y={bounds.top + groupHeaderHeight}
          width={bounds.width}
          height={bounds.height - groupHeaderHeight}
          className={this.state.backgroundClass}
          style={this.shapeStyle()}
        />
        <path
          d={[
            "M",
            bounds.left,
            bounds.top + groupHeaderHeight - 1,
            "v",
            -(groupHeaderHeight - 1),
            "h",
            bounds.width / 2,
            "v",
            groupHeaderHeight - 1
          ].join(" ")}
          className={this.state.backgroundClass}
          style={this.shapeStyle()}
        />
      </>
    );
  }
}
