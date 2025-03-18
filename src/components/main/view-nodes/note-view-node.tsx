import DefaultViewNode, { IViewNodeProps } from "./default-element";
import { JSX } from "react";
export default class NoteViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      backgroundClass: "archimate-note-background",
      textAlign: "left",
      textBounds: this.props.viewNode.absolutePosition().reducedBy(3)
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    return (
      <path
        d={[
          "m",
          bounds.left,
          bounds.top,
          "h",
          bounds.width,
          "v",
          bounds.height - 8,
          "l",
          -8,
          8,
          "h",
          -(bounds.width - 8),
          "z"
        ].join(" ")}
        className={this.state.backgroundClass}
        style={this.shapeStyle()}
      />
    );
  }
}
