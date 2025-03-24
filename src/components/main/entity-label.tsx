import type * as CSS from "csstype";
import * as React from "react";
import { Bounds, ViewNode } from "../../archimate-model";
import TextFlow from "./text-flow";

interface IProps {
  child: ViewNode;
  label: string;
  textBounds: Bounds;
  textAlign?: CSS.Property.TextAlign;
  badgeBounds: Bounds;
}

const EntityLabel: React.FC<IProps> = (props) => {
  const [textAnchor, setTextAnchor] =
    React.useState<CSS.Property.TextAnchor>("middle");
  // const lineHeight = 12; // TODO: This needs to be calculated

  React.useEffect(() => {
    switch (props.textAlign) {
      case "left":
        setTextAnchor("start");
        break;
      case "right":
        setTextAnchor("end");
        break;
      default:
        setTextAnchor("middle");
    }
  }, [props.textAlign]);

  if (!props.label || props.label.length === 0) {
    return undefined;
  }

  const clipPathD = () => {
    const tb = props.textBounds;
    if (props.badgeBounds && props.badgeBounds.height + 2 < tb.height) {
      const bb = props.badgeBounds;
      const badgeNotchHeight = bb.height + 2;
      return [
        "M",
        tb.left,
        tb.top,
        "h",
        tb.width - bb.width - 2,
        "v",
        badgeNotchHeight,
        "h",
        bb.width + 2,
        "v",
        tb.height - badgeNotchHeight,
        "h",
        -tb.width,
        "z",
      ]
        .map((i) => i.toString())
        .join(" ");
    } else {
      return [
        "M",
        tb.left,
        tb.top,
        "h",
        tb.width,
        "v",
        tb.height,
        "h",
        -tb.width,
        "z",
      ]
        .map((i) => i.toString())
        .join(" ");
    }
  };

  const lineX = (idx = 0) => {
    if (props.textBounds === undefined) {
      return 0;
    }
    const textBounds = props.textBounds as Bounds;
    switch (textAnchor) {
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

  const textStyle = (
    textAnchor?: CSS.Property.TextAnchor,
  ): React.CSSProperties => {
    const style = props.child.style;
    if (style === undefined) {
      return {
        textAlign: "center",
        textAnchor: "middle",
      };
    }
    const cssStyle: React.CSSProperties = {};
    if (style.fontColor) {
      cssStyle.fill = style.fontColor.toRGBA();
    }
    if (style.font && style.font.name) {
      cssStyle.fontFamily = style.font.name;
    }
    if (style.font && style.font.size) {
      cssStyle.fontSize = style.font.size;
    }
    if (props.textAlign) {
      cssStyle.textAlign = props.textAlign;
    }
    if (style.textAlignment) {
      cssStyle.textAlign = style.textAlignment;
    }
    cssStyle.textAnchor = textAnchor || textAnchor;
    return cssStyle;
  };

  const tb = props.textBounds;
  const clipPathId = `${props.child.id}-clip-path`;

  return (
    <>
      <clipPath id={clipPathId}>
        <path d={clipPathD()} />
      </clipPath>
      <text
        clipPath={`url(#${clipPathId})`}
        x={lineX()}
        y={tb.y}
        style={textStyle()}
      >
        <TextFlow
          text={props.label}
          bounds={props.textBounds}
          badgeBounds={props.badgeBounds}
          style={textStyle(textAnchor)}
        />
      </text>
    </>
  );
};

export default EntityLabel;
