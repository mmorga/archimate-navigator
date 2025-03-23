import { Set } from "immutable";
import { IEntity, IRelationship, LogicError } from "..";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Query } from "./query";
import { Relationship } from "./relationship";
import { RelationshipType } from "./relationship-type";

interface ISearchQueueItem {
  element: Element;
  depth: number;
}

export class QueryRunner {
  public query: Query;

  constructor(query: Query) {
    this.query = query;
  }

  // Using a Breadth First Search approach
  // Changes from a visit pattern to something that generates query results
  public run(): [Element[], Relationship[]] {
    const visited = Set<Element>(this.query.elements);
    const queue: ISearchQueueItem[] = Array.from(this.query.elements).map(
      (el) => ({ element: el, depth: 1 }),
    );

    const resultElements: Element[] = [];
    const resultRelationships: Relationship[] = [];

    while (queue.length > 0) {
      const item = queue.pop();
      if (!item) {
        throw new LogicError("queue shouldn't be undefined");
      }
      resultElements.push(item.element);
      item.element
        .relationships()
        .filter((rel) => rel.source && rel.target)
        .filter(relationshipTypesFilter(this.query.relationshipTypes))
        .filter(relationshipElementTypesFilter(this.query.elementTypes))
        .reduce(spiderRelationships, {
          maxPathDepth: this.query.pathDepth,
          queue,
          relationships: resultRelationships,
          searchQueueItem: item,
          visited,
        });
    }
    return [resultElements, resultRelationships];
  }
}

interface ISpiderAccumulator {
  maxPathDepth: number;
  queue: ISearchQueueItem[];
  relationships: Relationship[];
  searchQueueItem: ISearchQueueItem;
  visited: Set<Element>;
}

export function spiderRelationships(
  acc: ISpiderAccumulator,
  relationship: IRelationship,
): ISpiderAccumulator {
  const otherElement =
    relationship.sourceElement() === acc.searchQueueItem.element
      ? relationship.targetElement()
      : relationship.sourceElement();

  if (
    otherElement &&
    otherElement instanceof Element &&
    !acc.visited.includes(otherElement)
  ) {
    acc.relationships.push(relationship as Relationship);
    acc.visited = acc.visited.add(otherElement);
    if (acc.searchQueueItem.depth < acc.maxPathDepth) {
      acc.queue.push({
        depth: acc.searchQueueItem.depth + 1,
        element: otherElement,
      });
    }
  }
  return acc;
}

export function relationshipTypesFilter(
  relationshipTypes: Set<RelationshipType>,
): (relationship: IRelationship) => boolean {
  return (relationship: IRelationship) =>
    relationshipTypes.includes(relationship.type);
  // rt => (rt ? rt === relationship.type : false)
  // );
}

export function relationshipElementTypesFilter(
  elementTypes: Set<ElementType>,
): (relationship: IRelationship) => boolean {
  return (relationship: IRelationship) => {
    return [relationship.sourceElement(), relationship.targetElement()].every(
      elementTypeFilter(elementTypes),
    );
  };
}

export function elementTypeFilter(
  elementTypes: Set<ElementType>,
): (e: IEntity | undefined) => boolean {
  return (e: IEntity | undefined): boolean => {
    return (
      (e && e instanceof Element && elementTypes.includes(e.type)) || false
    );
  };
}
