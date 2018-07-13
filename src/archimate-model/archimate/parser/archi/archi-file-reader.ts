import { ParserError } from "../../interfaces";
import { Model } from "../../model";
import { DocumentationParser } from "./documentation-parser";
import { getStringAttribute } from "./dom-helpers";
import { ElementTagParser } from "./element-tag-parser";
import { FolderParser } from "./folder-parser";

export class ArchiFileReader {
  public parse(doc: XMLDocument) {
    const model = this.parseModel(doc);
    return this.fixBendpoints(model);
  }

  private parseModel(doc: XMLDocument) {
    const model = new Model();
    const modelNodes = doc.getElementsByTagNameNS(
      "http://www.archimatetool.com/archimate",
      "model"
    );
    if (modelNodes.length === 0) {
      throw new ParserError("Couldn't find a Model in the XMLDocument");
    }
    const modelNode = modelNodes[0];
    model.id = getStringAttribute(modelNode, "id") || model.makeUniqueId();
    model.name = getStringAttribute(modelNode, "name") || "ArchiMate Model";
    model.documentation = (new DocumentationParser()).value(modelNode, "purpose") || "";
    model.organizations = (new FolderParser(model)).organizations(modelNode);
    const elementTagParser = new ElementTagParser(model, doc)
    elementTagParser.elements();
    return model;
  }

  private fixBendpoints(model: Model) {
    // model
    //   .diagrams
    //   .flat_map(&:connections)
    //   .each do |connection|
    //     connection.bendpoints.each do |bendpoint|
    //       bendpoint.x += connection.start_location.x.to_i
    //       bendpoint.y += connection.start_location.y.to_i
    //     end
    //   end
    return model;
  }
}
