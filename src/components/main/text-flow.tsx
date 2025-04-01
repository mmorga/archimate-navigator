import "./archimate-svg.css";
import { Bounds } from "../../archimate-model";
import * as React from "react";

type TextLine = {
  text: string;
  maxWidth: number;
  calcWidth: number;
};

export default function TextFlow({
  text,
  bounds,
  badgeBounds,
  style,
}: {
  text: string;
  bounds: Bounds;
  badgeBounds: Bounds;
  style: React.CSSProperties;
}) {
  const getMaxLineWidth = (): number => {
    if (badgeBounds && badgeBounds.width > 0) {
      return bounds.width - (badgeBounds.width + 2);
    } else {
      return bounds.width;
    }
  };

  const calculateLines = (): TextLine[] => {
    const width = textWidth(text);
    const maxWidth = getMaxLineWidth();
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
  };

  return (
    <>
      {calculateLines().map((line, idx) => (
        <tspan
          x={lineX(idx)}
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
}
