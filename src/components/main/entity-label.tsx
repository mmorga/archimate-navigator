import { TextAlignProperty, TextAnchorProperty } from "csstype";
import * as React from "react";
import { Bounds, ViewNode } from "../../archimate-model";
import TextFlow from "./text-flow";

interface IProps {
  child: ViewNode;
  label: string;
  textBounds: Bounds;
  textAlign?: TextAlignProperty;
  badgeBounds: Bounds;
}

interface IState {
  textAnchor?: TextAnchorProperty; 
  lineHeight: number;
  bbox?: number;
  width?: number;
}

// **StereotypeLabel** < **Label**
//
// Split out any stereotype portion to render separately
//
// * Replace angle bracket characters with &laquo; and &raquo;
// * Apply stereotype styling
// * Position stereotype line as below
// * Adjust Label start position (move down line height for remaining label
//
// Take remaining text
//
// **Label**
//
// * ctor:
//     - rect to contain label
//     - text
//     - style
// * Figure out line breaks based on **Text** length
// * Render each line (that fits in the rect) in an SVG `text` element
export default class EntityLabel extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    let textAnchor: TextAnchorProperty = "middle";
    switch(this.props.textAlign) {
      case "left":
        textAnchor = "start";
        break;
      case "right":
        textAnchor = "end";
        break;
    }
    this.state = {
      lineHeight: 12, // TODO: This needs to be calculated
      textAnchor,
    };
  }

  public render() {
    if (!this.props.label || this.props.label.length === 0) {
      return undefined;
    }
    const tb = this.props.textBounds;
    const clipPathId = `${this.props.child.id}-clip-path`;
    return (
      <React.Fragment>
        <clipPath id={clipPathId}>
          <path d={this.clipPathD()} />
        </clipPath>
        <text clipPath={`url(#${clipPathId})`} x={this.lineX()} y={tb.y} style={this.textStyle()}>
          <TextFlow
              text={this.props.label} 
              bounds={this.props.textBounds}
              badgeBounds={this.props.badgeBounds} 
              style={this.textStyle(this.state.textAnchor)} 
          />
        </text>
      </React.Fragment>
    );
  }

  private clipPathD() {
    const tb = this.props.textBounds;
    if (this.props.badgeBounds && (this.props.badgeBounds.height + 2 < tb.height)) {
      const bb = this.props.badgeBounds;
      const badgeNotchHeight = bb.height + 2;
      return [
        "M", tb.left(), tb.top(),
        "h", tb.width - bb.width - 2,
        "v", badgeNotchHeight,
        "h", bb.width + 2,
        "v", tb.height - badgeNotchHeight,
        "h", - tb.width,
        "z"
      ].map(i => i.toString()).join(" ");
    } else {
      return [
        "M", tb.left(), tb.top(),
        "h", tb.width,
        "v", tb.height,
        "h", - tb.width,
        "z"
      ].map(i => i.toString()).join(" ");
    }
  }
  private lineX(idx = 0) {
    if (this.props.textBounds === undefined) {
      return 0;
    }
    const textBounds = this.props.textBounds as Bounds;
    switch(this.state.textAnchor) {
    case "start":
      return textBounds.left();
    case "end":
      if (idx > 0) {
        return textBounds.right();
      } else {
        return textBounds.right() - this.props.badgeBounds.width;
      }
    default:
      if (idx > 0) {
        return textBounds.center().x;
      } else {
        return textBounds.center().x - (this.props.badgeBounds.width / 2.0);
      }
    }
  }

  private textStyle(textAnchor?: TextAnchorProperty): React.CSSProperties {
    const style = this.props.child.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: React.CSSProperties = {};
    if (style.fontColor) { cssStyle.fill = style.fontColor.toRGBA() }
    if (style.font && style.font.name) { cssStyle.fontFamily = style.font.name }
    if (style.font && style.font.size) { cssStyle.fontSize = style.font.size }
    if (this.props.textAlign) { cssStyle.textAlign = this.props.textAlign } 
    if (style.textAlignment) { cssStyle.textAlign = style.textAlignment }
    cssStyle.textAnchor = textAnchor || (this.state ? this.state.textAnchor : "middle");
    return cssStyle;
  }
}
