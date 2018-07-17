import { Bounds } from "../../bounds";
import { Diagram } from "../../diagram";
import { IModel } from "../../interfaces";
import { ViewNode } from "../../view-node";
import { BoundsParser } from "./bounds-parser";
import { ConnectionParser } from "./connection-parser";
import { ContentParser } from "./content-parser";
import { DocumentationParser } from "./documentation-parser";
import { getNSStringAttribute, getStringAttribute } from "./dom-helpers";

export class ViewNodeParser {
  public model: IModel;
  public diagram: Diagram;
  public offset: Bounds;

  private documentationParser: DocumentationParser;
  private contentParser: ContentParser;
  private boundsParser: BoundsParser;

  constructor(model: IModel, diagram: Diagram, offset: Bounds) {
    this.model = model;
    this.diagram = diagram;
    this.offset = offset;
    this.createViewNode = this.createViewNode.bind(this);
    this.documentationParser = new DocumentationParser();
    this.contentParser = new ContentParser();
    this.boundsParser = new BoundsParser();
  }

  public viewNodes(parent: Element): ViewNode[] {
    const children = Array.from(parent.children).filter(node => node.nodeName === "child");
    if (children.length === 0) {
      return [];
    }
    return children
      .map(this.createViewNode)
      .reduce((acc: ViewNode[], curr: ViewNode[]) => acc.concat(curr));
  }

  private createViewNode(child: Element): ViewNode[] {
    const viewNode = new ViewNode(this.model, this.diagram);
    viewNode.id = getStringAttribute(child, "id") || this.model.makeUniqueId();
    viewNode.name = getStringAttribute(child, "name");
    viewNode.documentation = this.documentationParser.value(child);
    viewNode.type = (
      getNSStringAttribute(
        child,
        "type",
        "http://www.w3.org/2001/XMLSchema-instance"
      ) || ""
    ).replace("archimate:", "");

    // viewNode.style = TODO: write style parser
    viewNode.viewRefs = getStringAttribute(child, "model");
    viewNode.content = this.contentParser.content(child);
    if (child.parentElement!.nodeName === "child") {
      const parentEl = child.parentElement as Element;
      viewNode.parent = getStringAttribute(parentEl, "id");
    }
    // TODO: normalize bounds with parent(s)
    viewNode.bounds = this.boundsParser.bounds(child)!.offset(this.offset);
    viewNode.element = getStringAttribute(child, "archimateElement");
    viewNode.childType = getStringAttribute(child, "type");
    this.diagram.nodes.push(viewNode);
    const connectionParser = new ConnectionParser(
      this.model,
      this.diagram,
      viewNode.bounds
    );
    connectionParser.connections(child);
    const viewNodeParser = new ViewNodeParser(
      this.model,
      this.diagram,
      viewNode.bounds
    );
    return [viewNode].concat(viewNodeParser.viewNodes(child));
   }
}
