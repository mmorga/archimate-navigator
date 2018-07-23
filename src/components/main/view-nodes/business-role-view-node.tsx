import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class BusinessRoleViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "#archimate-role-badge",
    };
  }
}
