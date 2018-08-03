import { Bounds } from "./bounds";
import { Connection } from "./connection";
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
  public connections: Connection[];
  public path: string;
  private model: IModel;
  private elementsCache?: Element[];
  private relationshipsCache?: Relationship[];
  private diagramsCache?: Diagram[];

  constructor(model: IModel, type: DiagramType) {
    this.model = model;
    this.id = this.model.makeUniqueId();
    this.type = type;
    this.properties = [];
    this.nodes = [];
    this.connections = [];
    this.path = `svg/${this.id}.svg`;
  }

  public relationships(): Relationship[] {
    // TODO: expire this if the diagram changes
    // if (this.relationshipsCache) {
    //   return this.relationshipsCache;
    // }
    this.relationshipsCache = this.connections
        .map(conn => conn.entityInstance())
        .filter(el => el !== undefined)
        .map(rel => rel as Relationship);
    return this.relationshipsCache;
  }

  public elements(): Element[] {
    // TODO: expire this if the diagram changes
    // if (this.elementsCache) {
    //   return this.elementsCache;
    // }
    this.elementsCache = this.nodes
        .map(viewNode => viewNode.entityInstance())
        .filter(entity => entity instanceof Element)
        .map(el => el as Element);
    return this.elementsCache;
  }

  public diagrams(): Diagram[] {
    // TODO: expire this if the diagram changes
    if (this.diagramsCache) {
      return this.diagramsCache;
    }
    this.diagramsCache = this.nodes
        .map(viewNode => viewNode.entityInstance())
        .filter(entity => entity instanceof Diagram)
        .map(el => el as Diagram);
    return this.diagramsCache;
  }

  public toString() {
    return `Diagram<${this.id}>[${this.name}]`;
  }

  public totalViewpoint() {
    return this.viewpoint !== undefined;
  }

  public viewpointDescription(): string {
    if (this.viewpoint === undefined) {
      switch(this.type) {
        case "canvas:CanvasModel":
          return "Canvas";
        case "archimate:SketchModel":
          return "Sketch";
        default:
          return "Total";
      }  
    }
    return this.viewpoint.toString();
  }

  public calculateMaxExtents() {
    const nodeVals =
      this.nodes
          .map(node => {
            const bounds = node.bounds as Bounds;
            return new Bounds(node.x || bounds.x || 0, node.y || bounds.y || 0, bounds.width, bounds.height);
          })
          .map(bounds => [bounds.x || 0, bounds.y || 0, bounds.width, bounds.height]);
          // TODO: Add connection calculation
    // doc.css(".archimate-relationship")
    //   .each { |path|
    //     path.attr("d").split(" ").each_slice(3) do |point|
    //       nodeVals << [point[1].to_i, point[2].to_i, 0, 0]
    //     end
    //   }

    if (nodeVals.length < 1) {
      return {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      };
    }

    const minFunc = (prev: undefined | number, cur: number) => {
      let p = prev || Number.MAX_SAFE_INTEGER;
      if (cur < p) {
        p = cur;
      }
      return p;
    }
    const maxFunc = (prev: undefined | number, cur: number) => {
      let p = prev || Number.MIN_SAFE_INTEGER;
      if (cur > p) {
        p = cur;
      }
      return p;
    }
    const minX = nodeVals.map(v => v[0]).reduce(minFunc);
    const maxX = nodeVals.map(v => v[0] + v[2]).reduce(maxFunc);
    const minY = nodeVals.map(v => v[1]).reduce(minFunc);
    const maxY = nodeVals.map(v => v[1] + v[3]).reduce(maxFunc);
    return {
      height: maxY - minY + 20,
      width: maxX - minX + 20,
      x: minX - 10,
      y: minY - 10,
    };
  }  
}
