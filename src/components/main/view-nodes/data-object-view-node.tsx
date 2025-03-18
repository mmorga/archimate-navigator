import { JSX } from "react";
import { Bounds } from "../../../archimate-model";
import DefaultViewNode, { IViewNodeProps } from "./default-element";

export default class DataObjectViewNode extends DefaultViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      margin: 8,
      textBounds: this.textBounds()
    };
  }

  public entityShape(): JSX.Element {
    const bounds = this.props.viewNode.absolutePosition();
    const style = this.shapeStyle();
    const decorStyle: React.CSSProperties = {
      stroke: style.stroke,
      strokeWidth: style.strokeWidth
    };
    return (
      <g className={this.state.backgroundClass}>
        <rect
          key="data-background"
          x={bounds.left}
          y={bounds.top}
          width={bounds.width}
          height={bounds.height}
          className={this.state.backgroundClass}
          style={style}
        />
        <rect
          key="data-decoration"
          x={bounds.left}
          y={bounds.top}
          width={bounds.width}
          height={this.state.margin}
          className="archimate-decoration"
          style={decorStyle}
        />
      </g>
    );
  }

  protected textBounds() {
    const textBounds = super.textBounds();
    const margin: number = 8;
    return new Bounds(
      textBounds.left,
      textBounds.top + margin,
      textBounds.width,
      textBounds.height - margin
    );
  }
}
