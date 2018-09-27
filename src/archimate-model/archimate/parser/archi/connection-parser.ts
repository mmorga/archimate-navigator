import { Bounds } from "../../bounds";
import { Connection } from "../../connection";
import { Diagram } from "../../diagram";
import { IModel, ParserError } from "../../interfaces";
import { BendpointParser } from "./bendpoint-parser";
import { DocumentationParser } from "./documentation-parser";
import { getNSStringAttribute, getStringAttribute } from "./dom-helpers";
import { StyleParser } from "./style-parser";

export class ConnectionParser {
  public model: IModel;
  public diagram: Diagram;
  public offset: Bounds;
  private documentationParser: DocumentationParser;
  private bendpointParser: BendpointParser;
  private styleParser: StyleParser;

  constructor(model: IModel, diagram: Diagram, offset: Bounds) {
    this.model = model;
    this.diagram = diagram;
    this.offset = offset;
    this.documentationParser = new DocumentationParser();
    this.bendpointParser = new BendpointParser();
    this.styleParser = new StyleParser();
  }

  public connections(parent: Element): Connection[] {
    const children = Array.from(parent.children).filter(
      node => node.nodeName === "sourceConnection"
    );
    if (children === undefined) {
      return [];
    }
    return children.map(this.createConnection);
  }

  private createConnection = (child: Element): Connection => {
    const type =
      getNSStringAttribute(
        child,
        "type",
        "http://www.w3.org/2001/XMLSchema-instance"
      ) || "Connection";
    const source = getStringAttribute(child, "source");
    const target = getStringAttribute(child, "target");
    const id = getStringAttribute(child, "id");
    if ([source, target].some(s => s === undefined)) {
      throw new ParserError(
        `Element id=${id} Type=${type}, Source=${source} or Target=${target} missing from Connection`
      );
    }
    const connection = new Connection(
      this.model,
      type as string,
      source as string,
      target as string
    );
    connection.id =
      getStringAttribute(child, "id") || this.model.makeUniqueId();
    connection.name = getStringAttribute(child, "name");
    connection.documentation = this.documentationParser.value(child);
    connection.bendpoints = this.bendpointParser.bendpoints(child);
    connection.relationship = getStringAttribute(
      child,
      "archimateRelationship"
    );
    connection.style = this.styleParser.style(child);
    this.diagram.connections.push(connection);
    return connection;
  }
}
