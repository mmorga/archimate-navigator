import { Bounds, zeroBounds } from "./bounds";
import { IModel } from "./interfaces";
import { Point } from "./point";
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
export class Connection {
  public id: string;
  public name?: string;
  public documentation?: string;
  public type?: string;
  public sourceAttachment?: string; // Location
  public bendpoints: Point[] = []; // Location[]
  public targetAttachment?: string; // Location
  public source?: string;
  public target?: string;
  public relationship?: string;
  public style?: string; // Style

  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
    this.id = model.makeUniqueId();
  }

  public typeName() {
    return `Connection[${this.name || ""}]`;
  }

  public element() {
    return this.model.lookup(this.relationship);
  }

  public toString() {
    return `${this.typeName} ${this.source || "nothing"} -> ${this.target ||
      "nothing"}`;
  }

  // public description() {
  //   [
  //     name.nil? ? nil : "#{name}: ",
  //     source&.description,
  //     relationship&.description,
  //     target&.description
  //   ].compact.join(" ")
  // }

  // public startLocation() {
  //   return this.sourceAttachment || this.sourceBounds().center();
  // }

  // public endLocation() {
  //   return this.targetAttachment || this.targetBounds().center();
  // }

  public sourceViewNode() {
    if (this.source === undefined) {
      return undefined;
    }
    return this.model.lookup(this.source);
  }

  public targetViewNode() {
    if (this.target === undefined) {
      return undefined;
    }
    return this.model.lookup(this.target);
  }

  public sourceBounds(): Bounds | undefined {
    const svn = this.sourceViewNode();
    return svn ? (svn as ViewNode).bounds : undefined;
  }

  public targetBounds(): Bounds | undefined {
    const tvn = this.targetViewNode();
    return tvn ? (tvn as ViewNode).bounds : undefined;
  }

  // This is used when rendering a connection to connection relationship.
  public nodes() {
    return [];
  }

  // TODO: Implement me
  public absolutePosition() {
    // pt = Svg::Path.new(self).midpoint
    // return Bounds.new(x: pt.x, y: pt.y, width: 0, height: 0)
    return zeroBounds();
  }

  // public replace_item_with(item, replacement) {
  //   super
  //   item.remove_reference(self)
  //   case item
  //   when relationship
  //     @relationship = replacement
  //   else
  //     raise "Trying to replace #{item} that I don't reference"
  //   }
  // }
}
