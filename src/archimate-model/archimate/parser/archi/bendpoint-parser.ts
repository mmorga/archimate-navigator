import { Point } from "../../point";
import { getStringAttribute } from "./dom-helpers";

export class BendpointParser {
  public bendpoints(parent: Element): Point[] {
    const children = Array.from(parent.children).filter(
      (node) => node.nodeName === "bendpoint",
    );
    if (children === undefined) {
      return [];
    }
    return children.map(this.createPoint);
  }

  private createPoint = (child: Element): Point => {
    return new Point(
      this.parseAttrInt(child, "startX"),
      this.parseAttrInt(child, "startY"),
    );
  };

  private parseAttrInt(child: Element, attrName: string): number {
    const str = getStringAttribute(child, attrName) || "0";
    const i = Number.parseInt(str, 10);
    if (Number.isNaN(i)) {
      return 0;
    }
    return i as number;
  }
}
