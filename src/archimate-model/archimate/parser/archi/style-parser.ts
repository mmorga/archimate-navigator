import { TextAlignProperty } from "../../../../../node_modules/csstype";
import { Color } from "../../color";
import { Font } from "../../font";
import { Style } from "../../style";
import { getIntAttribute, getStringAttribute } from "./dom-helpers";

export class StyleParser {
  public style(element: Element): Style | undefined {
    const s = new Style();
    const textAlignment = getStringAttribute(element, "textAlignment");
    const fillColor = Color.rgba(getStringAttribute(element, "fillColor"));
    const lineColor = Color.rgba(getStringAttribute(element, "lineColor"));
    const fontColor = Color.rgba(getStringAttribute(element, "fontColor"));
    const font = Font.archiFontString(getStringAttribute(element, "font"));
    const lineWidth = getIntAttribute(element, "lineWidth");
    const textPosition = getIntAttribute(element, "textPosition");
    if (textAlignment) {
      s.textAlignment = textAlignment as TextAlignProperty;
    }
    if (fillColor) {
      s.fillColor = fillColor;
    }
    if (lineColor) {
      s.lineColor = lineColor;
    }
    if (fontColor) {
      s.fontColor = fontColor;
    }
    if (font) {
      s.font = font;
    }
    if (lineWidth) {
      s.lineWidth = lineWidth;
    }
    if (textPosition) {
      s.textPosition = textPosition;
    }
    return s;
  }
}
