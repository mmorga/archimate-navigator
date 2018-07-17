import { Bounds } from "../../bounds";
import { Connection } from "../../connection";
import { Diagram } from "../../diagram";
import { IModel } from "../../interfaces";
import { DocumentationParser } from "./documentation-parser";
import { getNSStringAttribute, getStringAttribute } from "./dom-helpers";

// TODO:
// when "bendpoint"
//   Location

export class ConnectionParser {
  public model: IModel;
  public diagram: Diagram;
  public offset: Bounds;
  private documentationParser: DocumentationParser;

  constructor(model: IModel, diagram: Diagram, offset: Bounds) {
    this.model = model;
    this.diagram = diagram;
    this.offset = offset;
    this.createConnection = this.createConnection.bind(this);
    this.documentationParser = new DocumentationParser();
  }

  public connections(parent: Element): Connection[] {
    const children = Array.from(parent.children).filter(node => node.nodeName === "sourceConnection");
    if (children === undefined) {
      return [];
    }
    return children.map(this.createConnection);
  }

  private createConnection(child: Element): Connection {
    const connection = new Connection(this.model);
    connection.id =
      getStringAttribute(child, "id") || this.model.makeUniqueId();
    connection.name = getStringAttribute(child, "name");
    connection.documentation = this.documentationParser.value(child);
    connection.type = getNSStringAttribute(
      child,
      "type",
      "http://www.w3.org/2001/XMLSchema-instance"
    );
    connection.bendpoints = []; // TODO
    connection.source = getStringAttribute(child, "source");
    connection.target = getStringAttribute(child, "target");
    connection.relationship = getStringAttribute(child, "archimateRelationship");
    // viewNode.style = TODO: write style parser
    this.diagram.connections.push(connection);
    return connection;
  }
}
