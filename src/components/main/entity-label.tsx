import * as React from "react";
import { TextAlignProperty } from "../../../node_modules/csstype";
import { Bounds } from "../../archimate-model/archimate/bounds";
import { ViewNode } from "../../archimate-model/archimate/view-node";

interface IProps {
  child: ViewNode;
  label: string;
  textBounds: Bounds;
  textAlign?: TextAlignProperty;
  badgeBounds: Bounds;
}

interface IState {
  textAnchor?: string; 
  lineHeight: number;
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
    let textAnchor = "middle";
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
    // TODO: What's the general shape here? Do I need to put the text into a group that clips?
    // this.textStyles().reduce(this.props.textBounds.top) do |y, (str, length, line_height, text_class)|
    //   return if y + line_height > this.props.textBounds.bottom
    // return (
    //   <text
    //       x={this.lineX()}
    //       y={this.props.textBounds.top() + this.state.lineHeight}
    //       /* style={this.textStyles()} */
    //       textAnchor={this.state.textAnchor}
    //       >
    //     {this.props.label}
    //   </text>
    // );
    const tb = this.props.textBounds;
    return (
      <foreignObject x={tb.left()} y={tb.top()} width={tb.width} height={tb.height}>
        <table style={{height:tb.height,width:tb.width}}>
          <tbody>
            <tr style={{height:tb.height}}>
              <td className="entity-name">
                <p className="entity-name" style={this.textStyle()}>{this.props.label}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </foreignObject>
    );
      // xml.text_(
      //   x: this.lineX(),
      //   y: y + line_height,
      //   textLength: length,
      //   lengthAdjust: "spacingAndGlyphs",
      //   class: text_class,
      //   style: text_style,
      //   "text-anchor" => this.state.textAnchor
      // ) do
      //   xml.text(str)
      // end
      // xml.polygon(
      //   points: this.polygonPath(),
      //   style: "stroke: red; stroke-width: 1px; stroke-dasharray: 3,3; fill: none;"
      // )
      // y + line_height
    // end
  }
  
  // public polygonPath()
  //   return [
  //         [this.props.textBounds.left, this.props.textBounds.top],
  //         [this.props.textBounds.right - this.badgeBounds.width, this.props.textBounds.top],
  //         [this.props.textBounds.right - this.badgeBounds.width, this.props.textBounds.top + this.badgeBounds.height],
  //         [this.props.textBounds.right, this.props.textBounds.top + this.badgeBounds.height],
  //         [this.props.textBounds.right, this.props.textBounds.bottom],
  //         [this.props.textBounds.left, this.props.textBounds.bottom]
  //       ].uniq.map { |x, y| "#{x},#{y}" }.join(" ")
  //     }

  public lineX() {
    if (this.props.textBounds === undefined) {
      return 0;
    }
    const textBounds = this.props.textBounds as Bounds;
    switch(this.state.textAnchor) {
    case "start":
      return textBounds.left();
    case "end":
      return textBounds.right() - this.props.badgeBounds.width;
    default:
      return textBounds.center().x - (this.props.badgeBounds.width / 2.0);
    }
  }

  public textLines(): string[] {
    return this.props.label.replace("\r\n", "\n").split(/[\r\n]/);
    // (entity.name || child.content).tr("\r\n", "\n").lines
  }

  public maxWidths(lineHeight: number): number[] {
    const rows = this.props.textBounds.height / lineHeight;
    const ary = new Array(rows);
    for (let i = 0; i < rows; i++) { ary[i] = i };
    return ary.map(i => {
      if (i * lineHeight < this.props.badgeBounds.height) {
        return this.props.textBounds.width - this.props.badgeBounds.width;
      } else {
        return this.props.textBounds.width;
      }
    });
  }

  // Splits the text of the entity by newlines and to fit space available
  // public textStyles() {
  //   return this.textLines().reduce((lines, line) => {
  //     const text = new Text(line, this.props.child.style);
  //     return lines.concat(
  //       text.layoutWithMax(this.maxWidths(text.lineHeight))
  //           .map((str, len) => [str, len, text.lineHeight, "entity-name"])
  //     )
  //   }, []);
  // }

  public textStyle(): React.CSSProperties {
    const style = this.props.child.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: React.CSSProperties = {};
    if (style.fillColor) { cssStyle.fill = style.fillColor.toRGBA() }
    if (style.fontColor) { cssStyle.color = style.fontColor.toRGBA() }
    if (style.font && style.font.name) { cssStyle.fontFamily = style.font.name }
    if (style.font && style.font.size) { cssStyle.fontSize = style.font.size }
    if (this.props.textAlign) { cssStyle.textAlign = this.props.textAlign } 
    if (style.textAlignment) { cssStyle.textAlign = style.textAlignment }
    return cssStyle;
  }
}
