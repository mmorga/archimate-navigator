import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class DiagramRefViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-diagram-model-reference-background",
      badge: "#archimate-diagram-model-reference-badge",
    };
  }
}
