import type * as CSS from "csstype";
import { Bounds, zeroBounds } from "./bounds";
import { Connection } from "./connection";
import { CSSProperties } from "react";
import { Diagram } from "./diagram";
import {
  IEntity,
  IEntityRef,
  IExtents,
  IModel,
  IProperty,
  IViewNode,
} from "./interfaces";
import { Style } from "./style";
import { elementTypeLayer, layerClassName } from "./layers";
import { elementTypeOfString } from "./element-type";
import BaseShape, {
  defaultTextBounds,
  enterBaseShape,
} from "../../components/main/view-nodes/base-shape";
import {
  EntityShapeComponent,
  EnterEntityShapeFunc,
} from "../../components/main/view-nodes/entity-shape-component";
import archimateElementTypeProps from "../../components/main/view-nodes/archimate-element-type-props";

export const VIEW_NODE_WIDTH = 120; // TODO: this should be from the SVG diagram settings
export const VIEW_NODE_HEIGHT = 55; // TODO: this should be from the SVG diagram settings

type badgeBoundsFunc = (viewNode: IViewNode) => Bounds | undefined;
type textBoundsFunc = (viewNode: IViewNode, x?: number, y?: number) => Bounds;
type IViewNodeCtorParams = {
  type: string;
  bounds: Bounds;
  element: string | undefined;
  id?: string;
  name?: string | undefined;
  documentation?: string;
  style?: Style | undefined;
  viewRefs?: string | undefined;
  content?: string | undefined;
  parent?: string | undefined;
  childType?: string | undefined;
};

// Graphical node type. It can contain child node types.
// This can be specialized as Label and Container
// In the ArchiMate v3 Schema, the tree of these nodes is:
// ViewConceptType(
//     LabelGroup (name LangString)
//     PreservedLangString
//     style (optional)
//     viewRefs
//     id)
// - ViewNodeType(
//       LocationGroup (x, y)
//       SizeGroup (width, height))
//   - Label(
//         conceptRef
//         attributeRef
//         xpathPart (optional)
//     )
//   - Container(
//         nodes (ViewNodeType)
//     - Element(
//           elementRef)
export class ViewNode implements IViewNode, IEntityRef {
  // ArchiMate ViewConceptType Attributes
  public id: string;
  public name?: string;
  public documentation?: string;
  // @note type here was used for the Element/Relationship/Diagram type
  public type: string;
  public style?: Style;

  // @note viewRefs are pointers to 0-* Diagrams for diagram drill in defined in abstract View Concept
  public viewRefs?: string;

  // @todo document where this comes from
  public content?: string;

  public properties: IProperty[] = [];

  // This is needed for various calculations
  public parent?: string;

  // ArchiMate ViewNodeType Attributes

  public bounds: Bounds;

  // ArchiMate Container Attributes
  // container doesn't distinguish between nodes and connections

  public nodes: IViewNode[] = [];
  public connections: object[] = [];

  // Element
  public element?: string;
  // Archi format, selects the shape of element (for elements that can have two or more shapes)
  // A nil value indicates the standard representation, a value of "1" indicates the alternate
  public childType?: string;

  public diagram: Diagram;

  // Node type to allow a Label in a Artifact. the "label" element holds the info for the @note.
  // Label View Nodes have the following attributes

  // conceptRef is a reference to an concept for this particular label, along with the attributeRef
  // which references the particular concept's part which this label represents.
  public conceptRef?: string;
  // conceptRef is a reference to an concept for this particular label, along with the partRef
  // which references the particular concept's part which this label represents. If this attribute
  // is set, then there is no need to add a label tag in the Label parent (since it is contained in the model).
  // the XPATH statement is meant to be interpreted in the context of what the conceptRef points to.
  // @!attribute [r] xpath_path
  // @return [String, NilClass]
  public xpathPath?: string;

  // D3.SimulationNodeDatum
  /**
   * Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
   */
  public index?: number;
  /**
   * Node’s current x-position
   */
  public x?: number;
  /**
   * Node’s current y-position
   */
  public y?: number;
  /**
   * Node’s current x-velocity
   */
  public vx?: number;
  /**
   * Node’s current y-velocity
   */
  public vy?: number;
  /**
   * Node’s fixed x-position (if position was fixed)
   */
  public fx?: number | null;
  /**
   * Node’s fixed y-position (if position was fixed)
   */
  public fy?: number | null;

  public badge: string | undefined;
  public backgroundClass: string;
  public entity: IEntity | undefined;
  public textAlign: CSS.Property.TextAlign;
  public badgeBounds: badgeBoundsFunc = zeroBounds;
  public textBounds: textBoundsFunc = defaultTextBounds;
  public EntityShape: EntityShapeComponent = BaseShape;
  public enterEntityShapeFunc: EnterEntityShapeFunc = enterBaseShape;

  private model: IModel;
  private defaultParams: IViewNodeCtorParams = {
    type: "ViewNode",
    bounds: zeroBounds(),
    element: undefined,
    // id?: string;
    // name: string;
    // documentation: string;
    // style: string;
    // viewRefs: string,
    // content: string;
    // parent: string;
    // childType: string;
  };
  constructor(model: IModel, diagram: Diagram, params?: IViewNodeCtorParams) {
    this.model = model;
    this.diagram = diagram;
    const p = {
      ...this.defaultParams,
      ...(params || {}),
    };
    this.type = p.type;
    this.bounds = p.bounds;
    this.element = p.element;
    this.id = p.id || this.model.makeUniqueId();
    if (p.name) {
      this.name = p.name;
    }
    if (p.documentation) {
      this.documentation = p.documentation;
    }
    if (p.style) {
      this.style = p.style;
    }
    if (p.viewRefs) {
      this.viewRefs = p.viewRefs;
    }
    if (p.content) {
      this.content = p.content;
    }
    if (p.parent) {
      this.parent = p.parent;
    }
    if (p.childType) {
      this.childType = p.childType;
    }
    this.entity = this.entityInstance();
    this.backgroundClass = layerClassName(
      elementTypeLayer(elementTypeOfString(this.elementType())),
    );
    this.textAlign = "center";
    archimateElementTypeProps(this);
  }

  public toString() {
    return `ViewNode[${this.name || ""}](${this.element ? this.element : ""})`;
  }

  public entityInstance(): IEntity | undefined {
    if (this.entity) {
      return this.entity;
    }
    if (this.viewRefs) {
      this.entity = this.model.lookup(this.viewRefs);
      return this.entity;
    }
    this.entity = this.model.lookup(this.element);
    return this.entity;
  }

  public elementType(): string {
    const elInst = this.entityInstance();
    if (elInst) {
      return elInst.type;
    } else {
      return this.type;
    }
  }

  // @todo Is this true for all or only Archi models?
  public absolutePosition(): Bounds {
    if (this.x === undefined || this.y === undefined) {
      console.log(
        "bad position",
        this.element,
        this.x,
        this.y,
        this.bounds.left,
        this.bounds.top,
      );
    }
    const bounds = new Bounds(
      this.x || this.bounds.left,
      this.y || this.bounds.top,
      this.bounds.width,
      this.bounds.height,
    );
    return bounds;
  }

  public extents(): IExtents {
    return {
      maxX: (this.x || this.bounds.left) + this.bounds.width,
      maxY: (this.y || this.bounds.top) + this.bounds.height,
      minX: this.x || this.bounds.left,
      minY: this.y || this.bounds.top,
    };
  }

  public inside(other: ViewNode | Connection): boolean {
    if (other instanceof Connection) {
      return false;
    }
    return this.bounds.inside((other as ViewNode).bounds);
  }

  //   const offset = this.bounds || zeroBounds();
  //   const el = this.parent;
  //   while (el.respond_to?(:bounds) && el.bounds) {
  //     const bounds = el.bounds
  //     offset = Bounds.new(
  //         offset.to_h.merge(x: (offset.x || 0) + (bounds.x || 0), y: (offset.y || 0) + (bounds.y || 0)))
  //     el = el.parent
  //   }
  //   return offset;
  // }

  // target_connections() {
  //   diagram
  //     .connections
  //     .select { |conn| conn.target&.id == id }
  //     .map(&:id)
  // }

  public center() {
    return this.bounds!.center();
  }

  public label(): string | undefined {
    if (this.content && this.content.length > 0) {
      return this.content;
    }
    if (this.name && this.name.length > 0) {
      return this.name;
    }
    const el = this.entityInstance();
    if (el === undefined) {
      return undefined;
    }
    return el.name;
  }

  public shapeStyle(): CSSProperties {
    const style = this.style;
    if (style === undefined) {
      return {};
    }
    const cssStyle: CSSProperties = {};
    if (style.fillColor) {
      cssStyle.fill = style.fillColor.toRGBA();
    }
    if (style.lineColor) {
      cssStyle.stroke = style.lineColor.toRGBA();
    }
    if (style.lineWidth) {
      cssStyle.strokeWidth = style.lineWidth;
    }
    return cssStyle;
  }
}

// Type is one of:  ["archimate:DiagramModelReference", "archimate:Group", "archimate:DiagramObject"]
// textAlignment "2"
// model is on only type of archimate:DiagramModelReference and is id of another element
//    type=archimate:ArchimateDiagramModel
// fillColor, lineColor, fontColor are web hex colors
// targetConnections is a string of space separated ids to connections on diagram objects found on DiagramObject
// archimateElement is an id of a model element found on DiagramObject types
// font is of this form: font="1|Arial|14.0|0|WINDOWS|1|0|0|0|0|0|0|0|0|1|0|0|0|0|Arial"
