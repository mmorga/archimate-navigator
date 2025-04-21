import { Bounds } from "../../bounds";
import { Diagram } from "../../diagram";
import { IModel } from "../../interfaces";
import { ViewNode } from "../../view-node";
import { BoundsParser } from "./bounds-parser";
import { ConnectionParser } from "./connection-parser";
import { ContentParser } from "./content-parser";
import { DocumentationParser } from "./documentation-parser";
import { getNSStringAttribute, getStringAttribute } from "./dom-helpers";
import { StyleParser } from "./style-parser";

export class ViewNodeParser {
  public model: IModel;
  public diagram: Diagram;
  public offset: Bounds;

  private documentationParser: DocumentationParser;
  private contentParser: ContentParser;
  private boundsParser: BoundsParser;
  private styleParser: StyleParser;

  constructor(model: IModel, diagram: Diagram, offset: Bounds) {
    this.model = model;
    this.diagram = diagram;
    this.offset = offset;
    this.documentationParser = new DocumentationParser();
    this.contentParser = new ContentParser();
    this.boundsParser = new BoundsParser();
    this.styleParser = new StyleParser();
  }

  public viewNodes(parent: Element): ViewNode[] {
    const children = Array.from(parent.children).filter(
      (node) => node.nodeName === "child",
    );
    if (children.length === 0) {
      return [];
    }
    return children
      .map(this.createViewNode)
      .reduce((acc: ViewNode[], curr: ViewNode[]) => acc.concat(curr));
  }

  private createViewNode = (child: Element): ViewNode[] => {
    let parent = undefined;
    if (child.parentElement!.nodeName === "child") {
      const parentEl = child.parentElement as Element;
      parent = getStringAttribute(parentEl, "id");
    }
    const viewNode = new ViewNode(this.model, this.diagram, {
      id: getStringAttribute(child, "id") || this.model.makeUniqueId(),
      name: getStringAttribute(child, "name"),
      documentation: this.documentationParser.value(child),
      type: (
        getNSStringAttribute(
          child,
          "type",
          "http://www.w3.org/2001/XMLSchema-instance",
        ) || ""
      ).replace("archimate:", ""),
      style: this.styleParser.style(child),
      viewRefs: getStringAttribute(child, "model"),
      content: this.contentParser.content(child),
      parent: parent,
      bounds: this.boundsParser.bounds(child)!.offset(this.offset),
      element: getStringAttribute(child, "archimateElement"),
      childType: getStringAttribute(child, "type"),
    });
    this.diagram.nodes.push(viewNode);
    this.model.register(viewNode);
    const connectionParser = new ConnectionParser(
      this.model,
      this.diagram,
      viewNode.bounds,
    );
    connectionParser.connections(child);
    const viewNodeParser = new ViewNodeParser(
      this.model,
      this.diagram,
      viewNode.bounds,
    );
    return [viewNode].concat(viewNodeParser.viewNodes(child));
  };
}
