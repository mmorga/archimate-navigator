import { Set } from "immutable";
import { Bounds } from "./bounds";
import { Connection } from "./connection";
import { Diagram } from "./diagram";
import { DiagramType } from "./diagram-type";
import { Element } from "./element";
import { ElementType, ElementTypes } from "./element-type";
import { IRelationship, LogicError } from "./interfaces";
import { Layer, Layers } from "./layers";
import { Model } from "./model";
import { QueryRunner } from "./query-runner";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { VIEW_NODE_HEIGHT, VIEW_NODE_WIDTH, ViewNode } from "./view-node";
import { ViewpointType, ViewpointTypeElementTypes } from "./viewpoint-type";

interface IQueryUpdateProps {
  elements?: Set<Element>;
  elementTypes?: Set<ElementType>;
  id?: string;
  includeDerivedRelations?: boolean;
  layerFilter?: Set<Layer>;
  model?: Model;
  name?: string;
  pathDepth?: number;
  relationships?: Set<Relationship>;
  relationshipTypes?: Set<RelationshipType>;
  viewpointType?: ViewpointType;
}

export type RelationshipFilter = (relationship: IRelationship) => boolean;
export const EmptyElementTypeSet = Set<ElementType>();

export class Query {
  public elements: Set<Element>;
  public elementTypes: Set<ElementType>;
  public id: string;
  public includeDerivedRelations: boolean;
  public layerFilter: Set<Layer>;
  public model: Model;
  public name: string;
  public pathDepth: number;
  public relationships: Set<Relationship>;
  public relationshipTypes: Set<RelationshipType>;
  public viewpointType: ViewpointType;

  constructor(model: Model) {
    this.elements = Set<Element>();
    this.elementTypes = Set<ElementType>(ElementTypes);
    this.id = model.makeUniqueId();
    this.includeDerivedRelations = false;
    this.layerFilter = Set<Layer>(Layers);
    this.model = model;
    this.name = "New Query";
    this.pathDepth = 2;
    this.relationships = Set<Relationship>();
    this.relationshipTypes = Set<RelationshipType>(RelationshipTypes);
    this.viewpointType = ViewpointType.Total;
  }

  public updateQuery(props: IQueryUpdateProps): Query {
    return Object.assign(new Query(this.model), this, props);
  }

  // TODO: This should return a set based on
  // * Selected Viewpoint <Done>
  // * Selected Layer
  // * Active/Passive Structure or Behavior
  public availableElementTypes(): Set<ElementType> {
    return Set<ElementType>(
      ViewpointTypeElementTypes.get(
        this.viewpointType || ViewpointType.Total,
      ) || ElementTypes,
    );
  }

  public unselectedElementTypes(): Set<ElementType> {
    return Set<ElementType>(
      this.availableElementTypes().filter(
        (et) => this.elementTypes.find((vet) => vet === et) === undefined,
      ),
    );
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
    const queryResult = new QueryRunner(this);
    const diagram = this.findOrCreateDiagram();
    const nodesConns = this.diagramNodesAndConnections(
      diagram,
      queryResult.run(),
    );
    diagram.name = this.name;
    // diagram.properties = TODO: convert this query into properties so queries can be saved in the standard file format
    diagram.viewpoint = this.viewpointType;
    diagram.nodes = nodesConns[0];
    diagram.connections = nodesConns[1];
    return diagram;
  }

  // TODO: re-write this. Diagram should only be added once to the Model. Updates should replace the
  // diagram in the model diagram set.
  private findOrCreateDiagram(): Diagram {
    let diagram = this.model.lookupDiagram(this.id);
    if (diagram) {
      return diagram;
    }
    diagram = new Diagram(this.model, DiagramType.ModelQuery);
    diagram.id = this.id;
    diagram.name = this.name;
    this.model.diagrams.push(diagram);
    this.model.viewOrganization().items.push(diagram.id);
    return diagram;
  }

  private diagramNodesAndConnections(
    diagram: Diagram,
    elementsRelationships: [Element[], Relationship[]],
  ): [ViewNode[], Connection[]] {
    const elements = elementsRelationships[0];
    const relationships = elementsRelationships[1];
    const relationshipElements = relationships.reduce(
      (acc: Element[], rel: Relationship) => {
        const source = rel.sourceElement();
        const target = rel.targetElement();
        if (source === undefined) {
          throw new LogicError(
            `Relationship ${rel.id} source ${rel.source} Element not found`,
          );
        }
        if (target === undefined) {
          throw new LogicError(
            `Relationship ${rel.id} target ${rel.target} Element not found`,
          );
        }
        return acc.concat([source as Element, target as Element]);
      },
      [],
    );

    const elementViewNodeMap: Map<string, ViewNode> = elements
      .concat(relationshipElements)
      .reduce(
        (acc: Map<string, ViewNode>, el: Element) =>
          acc.set(el.id, this.viewNodeFor(el, diagram)),
        new Map<string, ViewNode>(),
      );

    const connections: Connection[] = relationships.map((rel) =>
      this.connectionFor(rel, elementViewNodeMap),
    );

    return [Array.from(elementViewNodeMap.values()), connections];
  }

  // Then nodes are the reduction of the set of paths' elements mapped to ViewNodes
  // And connections are the reduction of the set of paths' relationships mapped to Connections
  private viewNodeFor(el: Element, diagram: Diagram): ViewNode {
    const vn = new ViewNode(this.model, diagram);
    vn.type = "archimate:DiagramObject";
    vn.bounds = new Bounds(700, 700, VIEW_NODE_WIDTH, VIEW_NODE_HEIGHT);
    vn.element = el.id;
    vn.diagram = diagram;
    return vn;
  }

  private connectionFor(
    relationship: Relationship,
    elementViewNodeMap: Map<string, ViewNode>,
  ): Connection {
    const sourceViewNode = elementViewNodeMap.get(relationship.source);
    const targetViewNode = elementViewNodeMap.get(relationship.target);
    if (sourceViewNode === undefined) {
      throw new LogicError(
        `Source ViewNode id: ${relationship.source} not found`,
      );
    }
    if (targetViewNode === undefined) {
      throw new LogicError(
        `Target ViewNode id: ${relationship.target} not found`,
      );
    }
    const conn = new Connection(
      this.model,
      "archimate:Connection",
      sourceViewNode.id,
      targetViewNode.id,
    );
    conn.relationship = relationship.id;
    return conn;
  }
}
