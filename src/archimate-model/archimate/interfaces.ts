import * as d3force from "d3-force";
import { AccessType } from "./access-type";
import { Bounds } from "./bounds";
import { Point } from "./point";
import { RelationshipType } from "./relationship-type";
import { Style } from "./style";

export interface IPoint {
  x: number;
  y: number;

  subtract(other: IPoint): number;
  toString(): string;
  inside(bounds: IBounds): boolean;
}

export interface IExtents {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}

export const InitExtents: IExtents = {
  maxX: Number.MIN_SAFE_INTEGER,
  maxY: Number.MIN_SAFE_INTEGER,
  minX: Number.MAX_SAFE_INTEGER,
  minY: Number.MAX_SAFE_INTEGER,
};

export interface IRange {
  begin: number;
  end: number;

  overlapMidpoint(r: IRange): number | undefined;
  cover(n: number): boolean;
}

export interface IBounds {
  x?: number;
  y?: number;
  width: number;
  height: number;

  xRange(): IRange;
  yRange(): IRange;
}

export interface IIdentifiable {
  id: string;
}

export interface IProperty {
  key: string;
  value?: string;
}

interface IHasProperties {
  properties: IProperty[];
}

export interface IEntity extends IIdentifiable, IHasProperties {
  readonly id: string;
  readonly name?: string;
  readonly href?: string;
  readonly documentation?: string;
  readonly type: string; // Model, Element, Relationship, or View
}

export interface IEntityRef {
  entityInstance(): IEntity | undefined;
}

export interface IRelationship extends IEntity {
  type: RelationshipType;
  source: string; // comparison_attr: :id, writable: true, default: nil
  target: string; // comparison_attr: :id, writable: true, default: nil
  accessType?: AccessType; // default: nil

  sourceElement(): IEntity | undefined;
  targetElement(): IEntity | undefined;
}

export interface IHasRelationships {
  relationships(): IRelationship[];
}

interface IElement extends IEntity, IHasRelationships {
  href?: string;
}

export interface IHasViews {
  diagrams(): IDiagram[];
}

export interface IViewConceptType extends IEntity {
  style?: Style;
  // @note viewRefs are pointers to 0-* Diagrams for diagram drill in defined in abstract View Concept
  viewRefs?: string;

  entityInstance(): IEntity | undefined;
  extents(): IExtents;
}

export interface IViewNode
  extends IViewConceptType,
    d3force.SimulationNodeDatum {
  absolutePosition(): Bounds;
  // @todo document where this comes from
  content?: string;

  // This is needed for various calculations
  parent?: string;

  // ArchiMate ViewNodeType Attributes

  bounds?: Bounds;

  // ArchiMate Container Attributes
  // container doesn't distinguish between nodes and connections

  // nodes: IViewNode[];
  // connections: object[];

  // Element
  element?: string;
  // Archi format, selects the shape of element (for elements that can have two or more shapes)
  // A nil value indicates the standard representation, a value of "1" indicates the alternate
  childType?: string;
}

/**
 * Data type for ArchiMate relationships
 */
export interface IConnection
  extends IViewConceptType,
    d3force.SimulationLinkDatum<IViewNode> {
  sourceAttachment?: Point;
  bendpoints: Point[];
  targetAttachment?: Point;
  source: string;
  target: string;
  relationship?: string;
  properties: IProperty[];
  // linkType: string;
  // weight: number;
}

export interface IDiagram extends IEntity, IHasRelationships, IHasViews {
  viewpoint?: string;
  nodes: IViewNode[];
  connectionRouterType?: string;
  background?: string;
  connections: object[];
  path: string;

  elements(): IElement[];
}

export interface IOrganization extends IEntity {
  organizations: IOrganization[];
  items: string[];
}

export interface IHasOrganizations extends IIdentifiable {
  organizations: IOrganization[];
}

class ExtendableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error(message).stack;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class ParserError extends ExtendableError {}

// tslint:disable-next-line:max-classes-per-file
export class LogicError extends ExtendableError {}

// tslint:disable-next-line:max-classes-per-file
export class UnsupportedFormat extends ExtendableError {
  public xmlns?: string;

  constructor(message: string, xmlns?: string) {
    super(message);
    this.xmlns = xmlns;
  }
}

export interface IModel extends IEntity, IHasOrganizations {
  // unique identifier of this model
  id: string;
  // name of the model
  name: string;
  // model documentation
  documentation?: string;
  // model properties
  properties: IProperty[];
  // model metadata
  metadata?: Map<string, object>;
  // model elements
  elements: IElement[];
  // model relationships
  relationships: IRelationship[];
  // model organization tree (aka Folders)
  organizations: IOrganization[];
  // property definitions
  propertyDefs: Map<string, IIdentifiable>;
  version?: string;
  diagrams: IDiagram[];
  viewpoints: IIdentifiable[];
  href?: string | undefined;
  type: string;

  lookup(id: string | undefined): IEntity | undefined;
  makeUniqueId(): string;
  register(entity: IEntity): void;
}
