import BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { IViewNodeProps } from "./default-element";

export default class InteractionViewNode extends BadgedRoundedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "#archimate-interaction-badge"
    };
  }
}
