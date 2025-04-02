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
import { runQuery } from "./query-runner";
import { Relationship } from "./relationship";
import { RelationshipType, RelationshipTypes } from "./relationship-type";
import { VIEW_NODE_HEIGHT, VIEW_NODE_WIDTH, ViewNode } from "./view-node";
import { ViewpointType, ViewpointTypeElementTypes } from "./viewpoint-type";

export type RelationshipFilter = (relationship: IRelationship) => boolean;
export const EmptyElementTypeSet = Set<ElementType>();

export type Query = {
  elements: Set<Element>;
  elementTypes: Set<ElementType>;
  id: string;
  includeDerivedRelations: boolean;
  layerFilter: Set<Layer>;
  model: Model;
  name: string;
  pathDepth: number;
  relationships: Set<Relationship>;
  relationshipTypes: Set<RelationshipType>;
  viewpointType: ViewpointType;
};

export function initQuery(model: Model) {
  return {
    elements: Set<Element>(),
    elementTypes: Set<ElementType>(ElementTypes),
    id: model.makeUniqueId(),
    includeDerivedRelations: false,
    layerFilter: Set<Layer>(Layers),
    model: model,
    name: "New Query",
    pathDepth: 2,
    relationships: Set<Relationship>(),
    relationshipTypes: Set<RelationshipType>(RelationshipTypes),
    viewpointType: ViewpointType.Total,
  };
}

type IQueryUpdateProps = Partial<Query>;

export function updateQuery(
  model: Model,
  query: Query,
  props: IQueryUpdateProps,
): Query {
  return Object.assign(initQuery(model), query, props);
}

// TODO: This should return a set based on
// * Selected Viewpoint <Done>
// * Selected Layer
// * Active/Passive Structure or Behavior
export function availableElementTypes(
  viewpointType: ViewpointType | undefined,
): Set<ElementType> {
  return Set<ElementType>(
    ViewpointTypeElementTypes.get(viewpointType || ViewpointType.Total) ||
      ElementTypes,
  );
}

export function unselectedElementTypes(
  query: Query,
  viewpointType: ViewpointType | undefined,
): Set<ElementType> {
  return Set<ElementType>(
    availableElementTypes(viewpointType).filter(
      (et) => query.elementTypes.find((vet) => vet === et) === undefined,
    ),
  );
}

export function run(query: Query, model: Model): Diagram {
  const diagram = findOrCreateDiagram(query, model);
  const nodesConns = diagramNodesAndConnections(
    model,
    diagram,
    runQuery(query),
  );
  diagram.name = query.name;
  // diagram.properties = TODO: convert this query into properties so queries can be saved in the standard file format
  diagram.viewpoint = query.viewpointType;
  diagram.nodes = nodesConns[0];
  diagram.connections = nodesConns[1];
  return diagram;
}

// TODO: re-write this. Diagram should only be added once to the Model. Updates should replace the
// diagram in the model diagram set.
function findOrCreateDiagram(query: Query, model: Model): Diagram {
  let diagram = model.lookupDiagram(query.id);
  if (diagram) {
    model.deleteDiagram(query.id);
  }
  diagram = new Diagram(model, DiagramType.ModelQuery);
  diagram.id = query.id;
  diagram.name = query.name;
  model.diagrams.push(diagram);
  model.viewOrganization().items.push(diagram.id);
  return diagram;
}

function diagramNodesAndConnections(
  model: Model,
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
        acc.set(el.id, viewNodeFor(model, el, diagram)),
      new Map<string, ViewNode>(),
    );

  const connections: Connection[] = relationships.map((rel) =>
    connectionFor(model, rel, elementViewNodeMap),
  );

  return [Array.from(elementViewNodeMap.values()), connections];
}

// Then nodes are the reduction of the set of paths' elements mapped to ViewNodes
// And connections are the reduction of the set of paths' relationships mapped to Connections
function viewNodeFor(model: Model, el: Element, diagram: Diagram): ViewNode {
  const vn = new ViewNode(model, diagram);
  vn.type = "archimate:DiagramObject";
  vn.bounds = new Bounds(700, 700, VIEW_NODE_WIDTH, VIEW_NODE_HEIGHT);
  vn.element = el.id;
  vn.diagram = diagram;
  return vn;
}

function connectionFor(
  model: Model,
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
    model,
    "archimate:Connection",
    sourceViewNode.id,
    targetViewNode.id,
  );
  conn.relationship = relationship.id;
  return conn;
}
