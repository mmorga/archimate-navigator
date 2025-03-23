import { IModel, ParserError } from "../../interfaces";
import { Property } from "../../property";
import { getStringAttribute } from "./dom-helpers";

export class PropertiesParser {
  public model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }

  public properties(parent: Element) {
    const els = Array.from(parent.children).filter(
      (node) => node.nodeName === "property",
    );
    if (els === null) {
      return [];
    }
    return els.map(this.handleElement);
  }

  private handleElement = (el: Element) => {
    const key = getStringAttribute(el, "key");
    const value = getStringAttribute(el, "value");
    if (key === undefined) {
      throw new ParserError("Property is missing key");
    }
    return new Property(key as string, value);
  };
}
