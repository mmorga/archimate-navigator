import { Bounds, ViewNode } from "../../../archimate-model";
import { CSSProperties } from "react";
import TextFlow from "../text-flow";
import type * as CSS from "csstype";

type IProps = {
  viewNode: ViewNode;
  textBounds: Bounds;
  textAlign?: CSS.Property.TextAlign;
  badgeBounds: Bounds;
};

const EntityLabel = ({
  viewNode,
  textBounds,
  textAlign,
  badgeBounds,
}: IProps) => {
  const textAnchor = calcTextAnchor(textAlign);
  // const lineHeight = 12; // TODO: This needs to be calculated
  const label = viewNode.label();

  if (
    ["AndJunction", "Junction"].includes(viewNode.elementType()) ||
    !label ||
    label.length === 0
  ) {
    return undefined;
  }

  const clipPathId = `${viewNode.id}-clip-path`;

  return (
    <>
      <clipPath id={clipPathId}>
        <path d={clipPathD(badgeBounds, textBounds)} />
      </clipPath>
      <text
        clipPath={`url(#${clipPathId})`}
        x={lineX(badgeBounds, textBounds, textAnchor)}
        y={textBounds.y}
        style={textStyle(viewNode, textAlign, textAnchor)}
      >
        <TextFlow
          text={label}
          bounds={textBounds}
          badgeBounds={badgeBounds}
          style={textStyle(viewNode, textAlign, textAnchor)}
        />
      </text>
    </>
  );
};

function textStyle(
  viewNode: ViewNode,
  textAlign: CSS.Property.TextAlign | undefined,
  textAnchor?: CSS.Property.TextAnchor,
): CSSProperties {
  const style = viewNode.style;
  if (style === undefined) {
    return {
      textAlign: "center",
      textAnchor: "middle",
    };
  }
  const cssStyle: CSSProperties = {};
  if (style.fontColor) {
    cssStyle.fill = style.fontColor.toRGBA();
  }
  if (style.font && style.font.name) {
    cssStyle.fontFamily = style.font.name;
  }
  if (style.font && style.font.size) {
    cssStyle.fontSize = style.font.size;
  }
  if (textAlign) {
    cssStyle.textAlign = textAlign;
  }
  if (style.textAlignment) {
    cssStyle.textAlign = style.textAlignment;
  }
  cssStyle.textAnchor = textAnchor || textAnchor;
  return cssStyle;
}

function calcTextAnchor(
  textAlign: CSS.Property.TextAlign | undefined,
): CSS.Property.TextAnchor {
  switch (textAlign) {
    case "left":
      return "start";
      break;
    case "right":
      return "end";
      break;
    default:
      return "middle";
  }
}

function clipPathD(badgeBounds: Bounds, textBounds: Bounds) {
  if (badgeBounds && badgeBounds.height + 2 < textBounds.height) {
    const bb = badgeBounds;
    const badgeNotchHeight = bb.height + 2;
    return [
      "M",
      textBounds.left,
      textBounds.top,
      "h",
      textBounds.width - bb.width - 2,
      "v",
      badgeNotchHeight,
      "h",
      bb.width + 2,
      "v",
      textBounds.height - badgeNotchHeight,
      "h",
      -textBounds.width,
      "z",
    ]
      .map((i) => i.toString())
      .join(" ");
  } else {
    return [
      "M",
      textBounds.left,
      textBounds.top,
      "h",
      textBounds.width,
      "v",
      textBounds.height,
      "h",
      -textBounds.width,
      "z",
    ]
      .map((i) => i.toString())
      .join(" ");
  }
}

function lineX(
  badgeBounds: Bounds,
  textBounds: Bounds,
  textAnchor: CSS.Property.TextAnchor,
  idx = 0,
) {
  if (textBounds === undefined) {
    return 0;
  }
  switch (textAnchor) {
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

export default EntityLabel;
