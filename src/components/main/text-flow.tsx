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

const TextFlow: React.FC<IProps> = (props) => {
  const [lines, setLines] = React.useState<ILine[]>([]);

  const getMaxLineWidth = (): number => {
    if (props.badgeBounds && props.badgeBounds.width > 0) {
      return props.bounds.width - (props.badgeBounds.width + 2);
    } else {
      return props.bounds.width;
    }
  };

  React.useEffect(() => {
    setLines(calculateLines());
  }, [props.text, props.bounds, props.badgeBounds]);

  const calculateLines = (): ILine[] => {
    const width = textWidth(props.text);
    const maxWidth = getMaxLineWidth();
    if (width <= maxWidth) {
      return [{ text: props.text, maxWidth, calcWidth: width }];
    }
    const words = props.text.split(" ");
    if (words.length === 1) {
      // TODO: split at maxWidth
      return [{ text: words[0], maxWidth, calcWidth: width }];
    } else {
      const lines: ILine[] = [];
      while (words.length > 0) {
        let line = words.shift() as string;
        let calcLineWidth = 0;
        while (
          words.length > 0 &&
          textWidth(`${line} ${words[0]}`) < maxWidth
        ) {
          line = `${line} ${words.shift()}`;
          calcLineWidth = textWidth(line);
        }
        lines.push({
          calcWidth: calcLineWidth,
          maxWidth,
          text: line,
        });
        line = "";
      }
      return lines;
    }
  };

  const textWidth = (str: string): number => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgDoc = svg.ownerDocument;
    if (!svgDoc) {
      return 0;
    }
    const text: SVGTextElement = svgDoc.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
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
  };

  const lineX = (idx = 0): number => {
    if (props.bounds === undefined) {
      return 0;
    }
    const textBounds = props.bounds as Bounds;
    switch (props.style.textAnchor) {
      case "start":
        return textBounds.left;
      case "end":
        if (idx > 0) {
          return textBounds.right;
        } else {
          return textBounds.right - props.badgeBounds.width;
        }
      default:
        if (idx > 0) {
          return textBounds.center().x;
        } else {
          return textBounds.center().x - props.badgeBounds.width / 2.0;
        }
    }
  };

  return (
    <>
      {lines.map((line, idx) => (
        <tspan
          x={lineX(idx)}
          dy="1.1em"
          className="entity-name"
          style={props.style}
          key={idx}
        >
          {line.text}
        </tspan>
      ))}
    </>
  );
};

export default TextFlow;
