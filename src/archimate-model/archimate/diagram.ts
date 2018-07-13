import { DiagramType } from "./diagram-type";
import { Element } from "./element";
import { IDiagram, IModel } from "./interfaces";
import { Property } from "./property";
import { Relationship } from "./relationship";
import { ViewNode } from "./view-node";

export class Diagram implements IDiagram {
  public id: string;
  public name?: string;
  public documentation?: string;
  public type: string;
  public properties: Property[];
  public viewpoint?: string;
  public nodes: ViewNode[];
  public connectionRouterType?: string;
  public background?: string;
  public connections: object[];
  public path: string;
  private model: IModel;

  constructor(model: IModel, type: DiagramType) {
    this.model = model;
    this.id = this.model.makeUniqueId();
    this.type = type;
    this.properties = [];
    this.nodes = [];
    this.connections = [];
    this.path = `svg/${this.id}.svg`;
  }

  // TODO: Implement me
  public relationships(): Relationship[] {
    return [];
  }

  // TODO: Implement me
  public elements(): Element[] {
    return [];
  }

  // TODO: Implement me
  public diagrams(): Diagram[] {
    return [];
  }

  // public allNodes(): ViewNode[] {
  //   return this.nodes.concat(
  //     this.nodes.flatMap((node) => node.allNodes(), this),
  //   );
  // }

  // elements() {
  //   @elements ||= all_nodes.map(&:element).compact
  // }

  // element_ids() {
  //   @element_ids ||= elements.map(&:id)
  // }

  // relationships() {
  //   @relationships ||= connections.map(&:relationship).compact
  // }

  // relationship_ids() {
  //   @relationship_ids ||= relationships.map(&:id)
  // }

  public toString() {
    return `Diagram<${this.id}>[${this.name}]`;
  }

  public totalViewpoint() {
    return this.viewpoint !== undefined;
  }

  // viewpoint_description() {
  //   switch(this.viewpoint) {
  //   case Symbol:
  //     viewpoint.to_s
  //   case Viewpoint:
  //     viewpoint.name.to_s
  //   default:
  //     switch(this.type) {
  //     case "canvas:CanvasModel":
  //       return "Canvas";
  //     case "archimate:SketchModel":
  //       return "Sketch";
  //     default:
  //       return "Total";
  //     }
  //   }
  // }
}
