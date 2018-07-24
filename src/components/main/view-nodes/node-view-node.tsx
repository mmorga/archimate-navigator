import BadgedNodeViewNode from "./badged-node-view-node";
import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class NodeViewNode extends BadgedNodeViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    if (this.props.viewNode.childType === "1") {
      this.state = {
        ...this.state,
        badge: "#archimate-node-badge",
       };
    } else {
      this.state = {
        ...this.state,
        badge: undefined,
        badgeBounds: undefined,
       };
    }
  }

  public entityShape(): JSX.Element {
    if (this.props.viewNode.childType === "1") {
      return BadgedRectViewNode.path(this.props.viewNode.absolutePosition(), this.state.backgroundClass, this.shapeStyle());
    } else {
      return super.entityShape();
    }
  }
}
