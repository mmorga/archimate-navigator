import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class BusinessActorViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "#archimate-actor-badge"
    };
  }
}
