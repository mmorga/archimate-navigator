import "./archimate-svg.css";
import { Bounds } from "../../archimate-model";
import { CSSProperties } from "react";
import { cssPropertiesToString } from "./view-nodes/style-utils";

type TextLine = {
  text: string;
  maxWidth: number;
  calcWidth: number;
};

const TextFlow = ({
  text,
  bounds,
  badgeBounds,
  style,
}: {
  text: string;
  bounds: Bounds;
  badgeBounds: Bounds;
  style: CSSProperties;
}) => {
  return (
    <>
      {calculateLines(text, bounds, badgeBounds).map((line, idx) => (
        <tspan
          x={lineX(bounds, badgeBounds, style, idx)}
          dy="1.1em"
          className="entity-name"
          style={style}
          key={idx}
        >
          {line.text}
        </tspan>
      ))}
    </>
  );
};

export const enterTextFlow = (
  parent: SVGTextElement,
  text: string,
  bounds: Bounds,
  badgeBounds: Bounds,
  style: CSSProperties,
) => {
  calculateLines(text, bounds, badgeBounds).map((line, idx) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    tspan.setAttribute("x", lineX(bounds, badgeBounds, style, idx).toString());
    tspan.setAttribute("dy", "1.1em");
    tspan.setAttribute("class", "entity-name");
    tspan.setAttribute("style", cssPropertiesToString(style));
    tspan.setAttribute("key", idx.toString());
    tspan.textContent = line.text;
    parent.appendChild(tspan);
    // <tspan
    //   x={lineX(bounds, badgeBounds, style, idx)}
    //   dy="1.1em"
    //   className="entity-name"
    //   style={style}
    //   key={idx}
    // >
    //   {line.text}
    // </tspan>
  });
};

function calculateLines(
  text: string,
  bounds: Bounds,
  badgeBounds: Bounds,
): TextLine[] {
  const width = textWidth(text);
  const maxWidth = getMaxLineWidth(bounds, badgeBounds);
  if (width <= maxWidth) {
    return [{ text: text, maxWidth, calcWidth: width }];
  }
  const words = text.split(" ");
  if (words.length === 1) {
    // TODO: split at maxWidth
    return [{ text: words[0], maxWidth, calcWidth: width }];
  } else {
    const lines: TextLine[] = [];
    while (words.length > 0) {
      let line = words.shift() as string;
      let calcLineWidth = 0;
      while (words.length > 0 && textWidth(`${line} ${words[0]}`) < maxWidth) {
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
}

function textWidth(str: string): number {
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
}

function lineX(
  bounds: Bounds,
  badgeBounds: Bounds,
  style: CSSProperties,
  idx = 0,
): number {
  if (bounds === undefined) {
    return 0;
  }
  const textBounds = bounds as Bounds;
  switch (style.textAnchor) {
    case "start":
      return textBounds.left;
    case "end":
      if (idx > 0) {
        return textBounds.right;
      } else {
        return textBounds.right - badgeBounds.width;
      }
    default:
      if (idx > 0) {
        return textBounds.center().x;
      } else {
        return textBounds.center().x - badgeBounds.width / 2.0;
      }
  }
}

function getMaxLineWidth(bounds: Bounds, badgeBounds: Bounds): number {
  if (badgeBounds && badgeBounds.width > 0) {
    return bounds.width - (badgeBounds.width + 2);
  } else {
    return bounds.width;
  }
}

export default TextFlow;
