import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class StickyViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-sticky-background"
    };
  }
}
