import { zeroBounds } from "../../bounds";
import { Diagram } from "../../diagram";
import { DiagramType } from "../../diagram-type";
import { IModel } from "../../interfaces";
import { DocumentationParser } from "./documentation-parser";
import { getStringAttribute } from "./dom-helpers";
import { PropertiesParser } from "./properties-parser";
import { ViewNodeParser } from "./view-node-parser";
import { ViewpointParser } from "./viewpoint-parser";

export class DiagramParser {
  public model: IModel;
  private documentationParser: DocumentationParser;
  private propertiesParser: PropertiesParser;
  private viewpointParser: ViewpointParser;

  constructor(model: IModel) {
    this.model = model;
    this.documentationParser = new DocumentationParser();
    this.propertiesParser = new PropertiesParser(model);
    this.viewpointParser = new ViewpointParser();
  }

  public diagram(domEl: Element, type: DiagramType): Diagram {
    const dia = new Diagram(this.model, type);
    dia.id = getStringAttribute(domEl, "id") || this.model.makeUniqueId();
    dia.name = getStringAttribute(domEl, "name");
    dia.documentation = this.documentationParser.value(domEl);
    dia.properties = this.propertiesParser.properties(domEl);
    dia.viewpoint = this.viewpointParser.viewpoint(domEl);
    const viewNodeParser = new ViewNodeParser(this.model, dia, zeroBounds());
    dia.nodes = viewNodeParser.viewNodes(domEl);
    return dia;
  }
}
