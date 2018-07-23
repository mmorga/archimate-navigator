import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class DistributionNetworkViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "#archimate-distribution-network-badge",
    };
  }
}
