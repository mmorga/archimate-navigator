import { CSSProperties } from "../../../node_modules/@types/react";
import { Bounds } from "../../archimate-model";
import "./archimate-svg.css";

export class TextFlow {
  private text: string;
  private bounds: Bounds;
  private badgeBounds: Bounds;
  private style: CSSProperties;
  private svg: SVGSVGElement;

  constructor(text: string, bounds: Bounds, badgeBounds: Bounds, style: CSSProperties) {
    this.text = text.trim();
    this.bounds = bounds;
    this.badgeBounds = badgeBounds;
    this.style = style;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }

  public lines() {
    const width = this.textWidth(this.text);
    const maxLineWidth = this.lineX();
    if (width <= maxLineWidth) {
      return [this.text];
    }
    const words = this.text.split(" ");
    if (words.length === 1) {
      return words;
    } else {
      const lines = [];
      while (words.length > 0) {
        let line = words.shift();
        while ((words.length > 0) && (this.textWidth(`${line} ${words[0]}`) < maxLineWidth)) {
          line = `${line} ${words.shift()}`;
        }
        lines.push(line);
        line = "";
      }
      return lines;
    }
  }

  public textWidth(str: string): number {
    const svgDoc = this.svg.ownerDocument;
    const text: SVGTextElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "0");
    text.setAttribute("y", "0");
    text.insertAdjacentText("afterbegin", str);
    this.svg.insertAdjacentElement("afterbegin", text);
    const body = document.querySelector("body");
    if (body) {
      body.insertAdjacentElement("beforeend", this.svg);
      const bbox = text.getBBox();
      return bbox.width;
    }

    return 0;
  }

    // public componentDidMount() {
  //   // const lines: string[] = [];
  //   for (let idx = 0; idx < this.state.lines.length; ++idx) {
  //     if (this.tspans[idx].current) {
  //       const tspan = (this.tspans[idx].current as SVGTSpanElement);
  //       const bbox = tspan.getBBox();
  //       const maxLineWidth = this.lineX(idx);

  //       if (this.state.bbox !== bbox.width) {
  //         this.setState({bbox: bbox.width});
  //       }
  //       if (this.state.width !== maxLineWidth) {
  //         this.setState({width: maxLineWidth});
  //       }
  //       // if (bbox.width > maxLineWidth) {
  //       //   const line = this.state.lines[idx];
  //       //   const maxLineChars = maxLineWidth / (bbox.width / line.length);
  //       //   let splitIdx = maxLineChars;
  //       //   while ((splitIdx > 0) && (line[splitIdx] !== " ")) {
  //       //     --splitIdx;
  //       //   }
  //       //   if (splitIdx < 0) {
  //       //     splitIdx = maxLineChars;
  //       //   }
  //       //   lines.push(
  //       //     line.substring(0, splitIdx),
  //       //     line.substring(splitIdx)
  //       //   )
  //       //   // const words = line.split(/[ \t]/)
  //       // } else {
  //       //   lines.push(lines[idx]);
  //       // }
  //     }
  //   };
  //   // if (this.linesChanged(lines)) {
  //   //   this.tspans = lines.map(l => React.createRef());
  //   //   this.setState({ lines });
  //   // }
  // }


  private lineX(idx = 0): number {
    if (this.bounds === undefined) {
      return 0;
    }
    const textBounds = this.bounds as Bounds;
    switch(this.style.textAnchor) {
    case "start":
      return textBounds.left();
    case "end":
      if (idx > 0) {
        return textBounds.right();
      } else {
        return textBounds.right() - this.badgeBounds.width;
      }
    default:
      if (idx > 0) {
        return textBounds.center().x;
      } else {
        return textBounds.center().x - (this.badgeBounds.width / 2.0);
      }
    }
  }

}