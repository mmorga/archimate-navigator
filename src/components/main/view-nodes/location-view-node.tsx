import BadgedRectViewNode from "./badged-rect";
import { IViewNodeProps } from "./default-element";

export default class LocationViewNode extends BadgedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-location-background",
      badge: "#archimate-location-badge"
    };
  }
}
