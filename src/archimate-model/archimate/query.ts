import { Set } from "immutable";
import { Bounds } from "./bounds";
import { Connection } from "./connection";
import { Diagram } from "./diagram";
import { DiagramType } from "./diagram-type";
import { Element } from "./element";
import { ElementType, ElementTypes } from "./element-type";
import { IEntity, IRelationship, LogicError } from "./interfaces";
import { Model } from "./model";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { ViewNode } from "./view-node";
import { ViewpointType } from "./viewpoint-type";

interface IQueryUpdateProps {
  elements?: Set<Element>;
  elementTypes?: Set<ElementType>;
  id?: string;
  includeDerivedRelations?: boolean;
  model?: Model;
  name?: string;
  pathDepth?: number;
  relationships?: Set<Relationship>;
  relationshipTypes?: Set<RelationshipType>;
  viewpoint?: ViewpointType;
}

interface ISearchQueueItem {
  element: Element;
  depth: number;
}

export type RelationshipFilter = (relationship: IRelationship) => boolean;

export class Query {
  public elements: Set<Element>;
  public elementTypes: Set<ElementType>;
  public id: string;
  public includeDerivedRelations: boolean;
  public model: Model;
  public name: string;
  public pathDepth: number;
  public relationships: Set<Relationship>;
  public relationshipTypes: Set<RelationshipType>;
  public viewpoint: ViewpointType;
  private diagram: Diagram;

  constructor(model: Model) {
    this.elements = Set<Element>();
    this.elementTypes = Set<ElementType>(ElementTypes);
    this.id = model.makeUniqueId();
    this.includeDerivedRelations = false;
    this.model = model;
    this.name = "New Query";
    this.pathDepth = 3;
    this.relationships = Set<Relationship>();
    this.relationshipTypes = Set<RelationshipType>(RelationshipTypes);
    this.viewpoint = ViewpointType.Total;
    this.diagram = new Diagram(this.model, DiagramType.ModelQuery);
    this.model.diagrams.push(this.diagram);
  }

  public updateQuery(props: IQueryUpdateProps): Query {
    return Object.assign(
      new Query(this.model),
      this,
      props
    );
  }

  // TODO: This should return a set based on 
  // * Selected Viewpoint
  // * Selected Layer
  // * Active/Passive Structure or Behavior
  public availableElementTypes(): Set<ElementType> {
    return Set<ElementType>(ElementTypes);
  }

  // Add this once Immutable v4 is released
  // public hashCode(): number {
  //   return hash(this);
  // }

  // public equals(other: any): boolean {
  //   return (
  //     (other instanceof Query) &&
  //     (this.id === other.id) &&
  //     (this.model === other.model) &&
  //     (this.name === other.name) &&
  //     (this.viewpoint === other.viewpoint) &&
  //     (this.elements === other.elements) &&
  //     (this.relationships === other.relationships) &&
  //     (this.pathDepth === other.pathDepth)
  //   );
  // }

  public run(): Diagram {
    const nodesConns = this.diagramNodesAndConnections(this.diagram, this.queryResultElementsAndRelationships());
    this.diagram.id = this.id;
    this.diagram.name = this.name;
    // diagram.properties = TODO: convert this query into properties so queries can be saved in the standard file format
    this.diagram.viewpoint = this.viewpoint;
    this.diagram.nodes = nodesConns[0];
    this.diagram.connections = nodesConns[1];
    return this.diagram;
  }

  private diagramNodesAndConnections(diagram: Diagram, elementsRelationships: [Element[], Relationship[]]): [ViewNode[], Connection[]] {
    const elements = elementsRelationships[0];
    const relationships = elementsRelationships[1];
    const elementViewNodeMap: Map<string, ViewNode> =
        elements.reduce(
          (acc: Map<string, ViewNode>, el: Element) => acc.set(el.id, this.viewNodeFor(el, diagram)),
          new Map<string, ViewNode>());

    const connections: Connection[] =
        relationships.map(rel => this.connectionFor(rel, elementViewNodeMap, diagram))

    return [Array.from(elementViewNodeMap.values()), connections];
  }

  // Then nodes are the reduction of the set of paths' elements mapped to ViewNodes
  // And connections are the reduction of the set of paths' relationships mapped to Connections
  private viewNodeFor(el: Element, diagram: Diagram): ViewNode {
    const vn = new ViewNode(this.model, diagram);
    vn.type = "archimate:DiagramObject";
    vn.bounds = new Bounds(700, 700, 120, 55);
    vn.element = el.id;
    vn.diagram = diagram;
    return vn;
  }

  private connectionFor(relationship: Relationship, elementViewNodeMap: Map<string, ViewNode>, diagram: Diagram): Connection {
    const sourceViewNode = elementViewNodeMap.get(relationship.source);
    const targetViewNode = elementViewNodeMap.get(relationship.target);
    if (sourceViewNode === undefined) {
      throw new LogicError("Source ViewNode not found");
    }
    if (targetViewNode === undefined) {
      throw new LogicError("Target ViewNode not found");
    }
    const conn = new Connection(
      this.model,
      "archimate:Connection",
      sourceViewNode.id,
      targetViewNode.id
    );
    conn.relationship = relationship.id;
    return conn;
  }

  // Using a Breadth First Search approach
  // Changes from a visit pattern to something that generates query results
  private queryResultElementsAndRelationships(): [Element[], Relationship[]] {
    let visited = Set<Element>(this.elements);
    const queue: ISearchQueueItem[] = 
        Array.from<Element>(this.elements.toJS())
        .map(el => ({element: el, depth: 0}));

    const resultElements: Element[] = [];
    const resultRelationships: Relationship[] = [];
    
    while(queue.length > 0) {
      const item = queue.pop();
      if (!item) {
        throw new LogicError("queue shouldn't be undefined");
      }
      resultElements.push(item.element);
      item.element.relationships()
          .filter(this.relationshipTypesFilter)
          .filter(this.relationshipElementTypesFilter)
          .forEach(relationship => {
        const otherElement = relationship.sourceElement() === item.element ? relationship.targetElement() : relationship.sourceElement();

        if (otherElement &&
           (otherElement instanceof Element) &&
           (!visited.includes(otherElement))) {
          resultRelationships.push(relationship as Relationship);
          visited = visited.add(otherElement);
          if (item.depth < this.pathDepth) {
            queue.push({element: otherElement, depth: item.depth + 1});
          }
        }
      });
    }
    return [resultElements, resultRelationships];
  }

  private relationshipTypesFilter(): RelationshipFilter {
    return ((relationship: IRelationship) => this.relationshipTypes.some(rt => rt ? rt === relationship.type : false));
  }

  private elementTypeFilter(e: IEntity | undefined): boolean {
    return (e && (e instanceof Element) && this.elementTypes.includes(e.type)) || false;
  }

  private relationshipElementTypesFilter(): RelationshipFilter {
    return ((relationship: IRelationship) => {
      return [
        relationship.sourceElement(),
        relationship.targetElement()
      ].every(this.elementTypeFilter);
    });
  }
}
