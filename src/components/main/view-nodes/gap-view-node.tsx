import { Bounds } from "../../../archimate-model";
import { IViewNodeProps } from "./default-element";
import DeliverableViewNode from "./deliverable-view-node";

export default class GapViewNode extends DeliverableViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-implementation2-background",
      badge: "#archimate-gap-badge",
      badgeBounds: new Bounds(this.props.viewNode.curBounds().right - 25, this.props.viewNode.curBounds().top + 5, 20, 20),
    };
  }
}
