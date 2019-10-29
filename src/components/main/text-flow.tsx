import * as React from "react";
import { Bounds } from "../../archimate-model";
import "./archimate-svg.css";

interface ILine {
  text: string;
  maxWidth: number;
  calcWidth: number;
}

interface IProps {
  text: string;
  bounds: Bounds;
  badgeBounds: Bounds;
  style: React.CSSProperties;
}

interface IState {
  lines: ILine[];
}

export default class TextFlow extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      lines: this.lines()
    };
  }

  public render() {
    return <>{this.tspans()}</>;
  }

  private lines(): ILine[] {
    const width = this.textWidth(this.props.text);
    const maxLineWidth = this.maxLineWidth();
    if (width <= maxLineWidth) {
      return [
        { text: this.props.text, maxWidth: maxLineWidth, calcWidth: width }
      ];
    }
    const words = this.props.text.split(" ");
    if (words.length === 1) {
      // TODO: split at maxLineWidth
      return [{ text: words[0], maxWidth: maxLineWidth, calcWidth: width }];
    } else {
      const lines: ILine[] = [];
      while (words.length > 0) {
        let line = words.shift() as string;
        let calcLineWidth = 0;
        while (
          words.length > 0 &&
          this.textWidth(`${line} ${words[0]}`) < maxLineWidth
        ) {
          line = `${line} ${words.shift()}`;
          calcLineWidth = this.textWidth(line);
        }
        lines.push({
          calcWidth: calcLineWidth,
          maxWidth: maxLineWidth,
          text: line
        });
        line = "";
      }
      return lines;
    }
  }

  private textWidth(str: string): number {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgDoc = svg.ownerDocument;
    if (!svgDoc) {
      return 0;
    }
    const text: SVGTextElement = svgDoc.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text.setAttribute("x", "0");
    text.setAttribute("y", "0");
    text.insertAdjacentText("afterbegin", str);
    svg.insertAdjacentElement("afterbegin", text);
    const body = document.querySelector("body");
    if (body) {
      body.insertAdjacentElement("beforeend", svg);
      const bbox = text.getBBox();
      body.removeChild(svg);
      return bbox.width;
    }

    return 0;
  }

  private maxLineWidth(idx = 0): number {
    if (this.props.badgeBounds && this.props.badgeBounds.width > 0) {
      return this.props.bounds.width - (this.props.badgeBounds.width + 2);
    } else {
      return this.props.bounds.width;
    }
  }

  private lineX(idx = 0): number {
    if (this.props.bounds === undefined) {
      return 0;
    }
    const textBounds = this.props.bounds as Bounds;
    switch (this.props.style.textAnchor) {
      case "start":
        return textBounds.left;
      case "end":
        if (idx > 0) {
          return textBounds.right;
        } else {
          return textBounds.right - this.props.badgeBounds.width;
        }
      default:
        if (idx > 0) {
          return textBounds.center().x;
        } else {
          return textBounds.center().x - this.props.badgeBounds.width / 2.0;
        }
    }
  }

  private tspans() {
    let idx = 0;
    return this.state.lines.map(line => (
      <tspan
        x={this.lineX(idx)}
        dy="1.1em"
        className="entity-name"
        style={this.props.style}
        key={++idx}
      >
        {line.text}
      </tspan>
    ));
  }
}
