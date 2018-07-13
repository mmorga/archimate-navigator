import { Bounds } from "../../bounds";
import { ParserError } from "../../interfaces";
import { getIntAttribute } from "./dom-helpers";

export class BoundsParser {
  public bounds(parentElement: Element) {
    const el = Array.from(parentElement.children).find(node => node.nodeName === "bounds");
    if (el === null) {
      return undefined;
    }
    const boundsEl = el as Element;
    const x = getIntAttribute(boundsEl, "x");
    const y = getIntAttribute(boundsEl, "y");
    const width = getIntAttribute(boundsEl, "width");
    const height = getIntAttribute(boundsEl, "height");

    if (width === undefined || height === undefined) {
      throw new ParserError("Invalid value for width or height");
    }
    return new Bounds(x, y, width as number, height as number);
  }
}
