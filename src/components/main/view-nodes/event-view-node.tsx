import { Bounds } from "../../../archimate-model";
import BadgedRoundedRectViewNode from "./badged-rounded-rect";
import { IViewNodeProps } from "./default-element";

export default class EventViewNode extends BadgedRoundedRectViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    const badge =
      this.props.viewNode.childType === "1"
        ? undefined
        : "#archimate-event-badge";
    this.state = {
      ...this.state,
      badge,
      badgeBounds: this.badgeBounds(),
      textBounds: this.textBounds()
    };
  }

  protected entityShape() {
    if (this.props.viewNode.childType === "1") {
      return this.eventPath();
    } else {
      return super.entityShape();
    }
  }

  protected badgeBounds(): Bounds | undefined {
    if (this.props.viewNode.childType === "1") {
      return undefined;
    } else {
      return super.badgeBounds();
    }
  }

  protected textBounds(): Bounds {
    if (this.props.viewNode.childType === "1") {
      const textBounds = super.textBounds();
      const notchX = 18;
      return new Bounds(
        textBounds.left + notchX * 0.8,
        textBounds.top,
        textBounds.width - notchX,
        textBounds.height
      );
    } else {
      return super.textBounds();
    }
  }

  private eventPath(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    const notchX = 18;
    const notchHeight = bounds.height / 2.0;
    const eventWidth = bounds.width * 0.85;
    const rx = 17;
    const d = [
      "M",
      bounds.left,
      bounds.top,
      "l",
      notchX,
      notchHeight,
      "l",
      -notchX,
      notchHeight,
      "h",
      eventWidth,
      "a",
      rx,
      notchHeight,
      0,
      0,
      0,
      0,
      -bounds.height,
      "z"
    ].join(" ");
    return (
      <path
        d={d}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }
}
