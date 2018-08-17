import { Bounds } from "./bounds";
import {
  IConnection,
  IEntity,
  IEntityRef,
  IExtents,
  IModel,
  InitExtents,
  IProperty,
  LogicError
} from "./interfaces";
import { Path } from "./path";
import { Point } from "./point";
import { Style } from "./style";
import { ViewNode } from "./view-node";

// Graphical connection type.
//
// If the 'relationshipRef' attribute is present, the connection should
// reference an existing ArchiMate relationship.
//
// If the connection is an ArchiMate relationship type, the connection's
// label, documentation and properties may be determined (i.e inherited)
// from those in the referenced ArchiMate relationship. Otherwise the
// connection's label, documentation and properties can be provided and will
// be additional to (or over-ride) those contained in the referenced
// ArchiMate relationship.
export class Connection implements IConnection, IEntityRef {
  public id: string;
  public name?: string;
  public documentation?: string;
  public type: string;
  public sourceAttachment?: Point;
  public bendpoints: Point[] = [];
  public targetAttachment?: Point;
  public source: string;
  public target: string;
  public relationship?: string;
  public style?: Style;
  public properties: IProperty[] = [];

  private model: IModel;
  private sourceEntity?: ViewNode | Connection;
  private targetEntity?: ViewNode | Connection;

  constructor(model: IModel, type: string, source: string, target: string) {
    this.model = model;
    this.id = model.makeUniqueId();
    this.type = type;
    this.source = source;
    this.target = target;
  }

  public typeName() {
    return `Connection[${this.name || ""}]`;
  }

  public entityInstance(): IEntity | undefined {
    return this.model.lookup(this.relationship);
  }

  public toString() {
    return `${this.typeName} ${this.source || "nothing"} -> ${this.target ||
      "nothing"}`;
  }

  public startLocation(): Point {
    return this.sourceAttachment || this.sourceBounds().center();
  }

  public endLocation(): Point {
    return this.targetAttachment || this.targetBounds().center();
  }

  public sourceViewNode(): ViewNode | Connection {
    if (this.sourceEntity) {
      return this.sourceEntity;
    }
    this.sourceEntity = this.srcTargetLookup(this.source);
    return this.sourceEntity;
  }

  public targetViewNode() {
    if (this.targetEntity) {
      return this.targetEntity;
    }
    this.targetEntity = this.srcTargetLookup(this.target);
    return this.targetEntity;
  }

  public sourceBounds(): Bounds {
    return this.sourceViewNode().absolutePosition();
  }

  public targetBounds(): Bounds {
    return this.targetViewNode().absolutePosition();
  }

  public inside(other: ViewNode | Connection): boolean {
    return false;
  }

  // This is used when rendering a connection to connection relationship.
  public nodes() {
    return [];
  }

  public absolutePosition() {
    const pt = new Path(this).midpoint();
    return new Bounds(pt.x, pt.y, 0, 0);
  }

  public extents(): IExtents {
    const path = new Path(this);
    return path.points.reduce((extents: IExtents, point: Point) => {
      return {
        maxX: Math.max(point.x, extents.maxX),
        maxY: Math.max(point.y, extents.maxY),
        minX: Math.min(point.x, extents.minX),
        minY: Math.min(point.y, extents.minY)
      };
    }, InitExtents);
  }

  private srcTargetLookup(id: string): ViewNode | Connection {
    const entity = this.model.lookup(id);
    if (entity === undefined) {
      throw new LogicError("Lookup failed for srcTargetLookup");
    }
    let srcOrTarget: ViewNode | Connection;
    if (entity instanceof ViewNode) {
      srcOrTarget = entity as ViewNode;
    } else if (entity instanceof Connection) {
      srcOrTarget = entity as Connection;
    } else {
      throw new LogicError("Lookup returned unexpected type");
    }
    return srcOrTarget;
  }
}
