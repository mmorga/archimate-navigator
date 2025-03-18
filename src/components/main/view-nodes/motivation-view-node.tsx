import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class MotivationViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badgeBounds: this.badgeBounds()
    };
  }

  protected entityShape() {
    const bounds = this.props.viewNode.absolutePosition();
    const margin = 10;
    const width = bounds.width - margin * 2;
    const height = bounds.height - margin * 2;
    return (
      <path
        d={[
          "M",
          bounds.left + margin,
          bounds.top,
          "h",
          width,
          "l",
          margin,
          margin,
          "v",
          height,
          "l",
          -margin,
          margin,
          "h",
          -width,
          "l",
          -margin,
          -margin,
          "v",
          -height,
          "z"
        ].join(" ")}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }

  protected badgeBounds(): Bounds {
    const bounds = this.props.viewNode.absolutePosition();
    return new Bounds(bounds.right - 25, bounds.top + 5, 20, 20);
  }
}
