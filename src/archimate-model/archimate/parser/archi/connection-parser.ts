import { Bounds } from "../../bounds";
import { Connection } from "../../connection";
import { Diagram } from "../../diagram";
import { IModel, ParserError } from "../../interfaces";
import { BendpointParser } from "./bendpoint-parser";
import { DocumentationParser } from "./documentation-parser";
import { getNSStringAttribute, getStringAttribute } from "./dom-helpers";

export class ConnectionParser {
  public model: IModel;
  public diagram: Diagram;
  public offset: Bounds;
  private documentationParser: DocumentationParser;
  private bendpointParser: BendpointParser;

  constructor(model: IModel, diagram: Diagram, offset: Bounds) {
    this.model = model;
    this.diagram = diagram;
    this.offset = offset;
    this.createConnection = this.createConnection.bind(this);
    this.documentationParser = new DocumentationParser();
    this.bendpointParser = new BendpointParser();
  }

  public connections(parent: Element): Connection[] {
    const children = Array.from(parent.children).filter(node => node.nodeName === "sourceConnection");
    if (children === undefined) {
      return [];
    }
    return children.map(this.createConnection);
  }

  private createConnection(child: Element): Connection {
    const type = getNSStringAttribute(
      child,
      "type",
      "http://www.w3.org/2001/XMLSchema-instance"
    );
    const source = getStringAttribute(child, "source");
    const target = getStringAttribute(child, "target");
    if ([type, source, target].some(s => s === undefined)) {
      throw new ParserError("Type, Source, or Target missing from Connection");
    }
    const connection = new Connection(this.model, type as string, source as string, target as string);
    connection.id =
      getStringAttribute(child, "id") || this.model.makeUniqueId();
    connection.name = getStringAttribute(child, "name");
    connection.documentation = this.documentationParser.value(child);
    connection.bendpoints = this.bendpointParser.bendpoints(child);
    connection.relationship = getStringAttribute(child, "archimateRelationship");
    // viewNode.style = TODO: write style parser
    this.diagram.connections.push(connection);
    return connection;
  }
}
