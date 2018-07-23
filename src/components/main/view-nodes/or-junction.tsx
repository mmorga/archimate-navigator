import { IViewNodeProps } from "./default-element";
import JunctionViewNode from "./junction";

export default class OrJunctionViewNode extends JunctionViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {...this.state, backgroundClass: "archimate-or-junction-background"};
  }
}
