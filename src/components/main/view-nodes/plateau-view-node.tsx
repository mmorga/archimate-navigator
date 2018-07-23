import BadgedNodeViewNode from "./badged-node-view-node";
import { IViewNodeProps } from "./default-element";

export default class PlateauViewNode extends BadgedNodeViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-implementation2-background",
      badge: "#archimate-plateau-badge",
    };
  }
}
