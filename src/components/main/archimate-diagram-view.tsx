import * as d3force from "d3-force";
import {is, Set} from "immutable";
import * as React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import * as wheel from "wheel";
import {
  Connection,
  Diagram,
  DiagramType,
  IConnection,
  IEntity,
  IEntityRef,
  IViewNode,
  LogicError,
  Point,
  VIEW_NODE_WIDTH,
  ViewNode
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import archimateViewNode from "./archimate-view-node";

interface IOffset {
  x: number;
  y: number;
}

interface IProps {
  selectedDiagram?: Diagram;
  nodes?: ViewNode[];
  connections?: Connection[];
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
  diagramClicked: entityClickedFunc;
}

enum ZoomMode {
  OneToOne,
  FitToWindow,
  FitToWindowWidth,
  UserZoom,
}

interface IState {
  clientHeight: number;
  clientWidth: number;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  scale: number;
  tx: number;
  ty: number;
  zoomMode: ZoomMode;
}

const defaultZoomSpeed = 0.065;
const DIAGRAM_MARGIN = 24;
const DEFAULT_DISTANCE = 30; // Default distance for D3 Force simulations

export default class ArchimateDiagramView extends React.PureComponent<
  IProps,
  IState
> {
  private svgTopGroup: React.RefObject<SVGGElement>;
  private forceLink?: d3force.ForceLink<ViewNode, Connection>;
  private simulation?: d3force.Simulation<ViewNode, Connection>;
  private prevNodes: Set<string>;
  private prevConnections: Set<string>;
  private minZoom: number = 0;
  private maxZoom: number = Number.POSITIVE_INFINITY;
  private storedCTMResult?: Point;

  constructor(props: IProps) {
    super(props);
    this.state = {
      clientHeight: 0,
      clientWidth: 0,
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
      scale: 1,
      tx: 0,
      ty: 0,
      zoomMode: ZoomMode.FitToWindow,
    };
    this.svgTopGroup = React.createRef();
    this.prevNodes = Set<string>();
    this.prevConnections = Set<string>();
  }

  public render() {
    if (this.props.selectedDiagram) {
      return (
        <>
          <div className="archimate-zoombar" style={{ position: "absolute", top: 0, right: 0 }}>
            <Button onClick={this.onOneHundredPercent}><small>1:1</small></Button>
            <Button onClick={this.onFitToWindow}><Glyphicon glyph="resize-full"/></Button>
            <Button onClick={this.onFitToWidth}><Glyphicon glyph="resize-horizontal"/></Button>
            <Button onClick={this.onZoomIn}><Glyphicon glyph="zoom-in"/></Button>
            <Button onClick={this.onZoomOut}><Glyphicon glyph="zoom-out"/></Button>
            <small>{"  "}{(this.state.scale * 100).toFixed(0)}%</small>
          </div>
          <ArchimateSvg
            key={this.props.selectedDiagram.id}
            diagramName={
              this.props.selectedDiagram ? this.props.selectedDiagram.name : ""
            }
            viewBox={this.viewBox()}
          >
            <g ref={this.svgTopGroup} transform={`matrix(${this.state.scale}, 0, 0, ${this.state.scale}, ${this.state.tx}, ${this.state.ty})`}>
              {this.nodes().map(node =>
                React.createElement(archimateViewNode(node), {
                  key: node.id,
                  onClicked: this.props.entityClicked,
                  selected: this.nodeIsSelected(node),
                  viewNode: node,
                  x: node.x || node.bounds.left,
                  y: node.y || node.bounds.top
                })
              )}
              {this.connections().map(conn => (
                <ArchimateConnection
                  autoLayout={this.isAutoLayout()}
                  key={conn.id}
                  connection={conn}
                  onClicked={this.props.entityClicked}
                  selected={this.nodeIsSelected(conn)}
                  fromX={conn.sourceBounds().left}
                  fromY={conn.sourceBounds().top}
                  toX={conn.targetBounds().left}
                  toY={conn.targetBounds().top}
                />
              ))}
            </g>
          </ArchimateSvg>
        </>
      );
    } else {
      return (
        <div
          className="jumbotron"
          style={{ paddingLeft: "2em", paddingRight: "2em" }}
        >
          <h1>ArchiMate Navigator</h1>
          <p>
            <Glyphicon glyph="arrow-left" />
            &nbsp; Select a diagram on the left to view.
          </p>
        </div>
      );
    }
  }

  public componentDidMount() {
    this.autoLayout();
    window.addEventListener("resize", this.onSvgResize);
    this.svgSize();
    this.extents();
    if (this.svgTopGroup.current && this.svgTopGroup.current.ownerSVGElement) {
      const svg = this.svgTopGroup.current.ownerSVGElement;
      wheel.addWheelListener(svg, this.onWheel);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    this.extents();
    this.calculateTransform();
    this.autoLayout();
  }

  public componentWillUnmount() {
    if (this.simulation) {
      this.simulation.stop();
    }
    window.removeEventListener("resize", this.onSvgResize);
    if (this.svgTopGroup.current && this.svgTopGroup.current.ownerSVGElement) {
      const svg = this.svgTopGroup.current.ownerSVGElement;
      wheel.removeWheelListener(svg, this.onWheel);
    }

  }

  private connections(): Connection[] {
    return this.props.connections ? this.props.connections : [];
  }

  private nodes(): ViewNode[] {
    return this.props.nodes ? this.props.nodes : [];
  }

  private isAutoLayout() {
    return (
      (this.props.selectedDiagram &&
        this.props.selectedDiagram.type === DiagramType.ModelQuery) ||
      false
    );
  }

  private autoLayout() {
    if ((this.props.selectedDiagram === undefined) || !this.isAutoLayout()) {
      if (this.simulation) {
        this.simulation.stop();
      }
      return;
    }

    // TODO: Needs to be a way to handle edges that connect to other edges
    //       current solution is to remove the edge from the selected set.
    const connections = this.connections().filter(
      c => c.targetViewNode() instanceof ViewNode
    );
    const nodes = this.nodes();

    // If our set of nodes and connections haven't changed, then nothing to do here.
    const nextConnections = Set.of<string>(...connections.map(c => c.id));
    const nextNodes = Set.of<string>(...nodes.map(n => n.id));
    if (is(this.prevConnections, nextConnections) &&
        is(this.prevNodes, nextNodes)) {
      return;
    }
    this.prevNodes = nextNodes;
    this.prevConnections = nextConnections;

    // TODO: look into doing this in a web worker
    if (this.simulation === undefined) {
      this.forceLink = d3force
          .forceLink<ViewNode, Connection>(connections)
          .id((node: IViewNode, i: number, nodesData: IViewNode[]) => node.id)
          .distance(this.adjustLinkDistance);
      this.simulation =
          d3force
            .forceSimulation(this.nodes())
            .force("center", d3force.forceCenter(this.center().x, this.center().y))
            .force("collide", d3force.forceCollide(VIEW_NODE_WIDTH))
            .force("link", this.forceLink)
            .force("charge", d3force.forceManyBody())
            .on("tick", this.ticked);
    } else {
      this.simulation.nodes(this.nodes());
      if (this.forceLink) {
        this.forceLink.links(connections);
      }
      this.simulation.alpha(1);
      this.simulation.restart();
    }
  }

  // •  Influence (weakest)
  // •  Access
  // •  Serving
  // •  Realization
  // •  Assignment
  // •  Aggregation
  // •  Composition (strongest)
  private adjustLinkDistance = (d: IConnection): number => {
    const rel = d.entityInstance();
    const relType = rel ? rel.type : "";
    const dist = (x: number) => DEFAULT_DISTANCE * x / 100;
    switch(relType) {
      case "Influence":
        return dist(200);
      case "Access":
        return dist(150);
      case "Serving":
        return dist(120);
      case "Realization":
        return dist(100);
      case "Assignment":
        return dist(80);
      case "Aggregation":
        return dist(60);
      case "Composition":
        return dist(50);
      default:
        return dist(100);
    }
  };

  /**
   * Called on each "tick" of the D3 Force simulation
   * Not to be called directly
   */
  private ticked = () => {
    if (this.simulation && this.props.selectedDiagram) {
      this.simulation.force(
        "center",
        d3force.forceCenter(this.center().x, this.center().y)
      );
      this.extents();
      this.onFitToWindow();
    }
    this.forceUpdate();
  };

  private nodeIsSelected(node: IEntityRef): boolean {
    if (this.props.selectedEntity === undefined) {
      return false;
    }
    const nodeElement = node.entityInstance();
    if (nodeElement === undefined) {
      return false;
    }
    return this.props.selectedEntity.id === nodeElement.id;
  }

  private calculateTransform = () => {
    const width = this.state.maxX - this.state.minX;
    const height = this.state.maxY - this.state.minY;
    const scalex = this.state.clientWidth / (width + DIAGRAM_MARGIN);
    const scaley = this.state.clientHeight / (height + DIAGRAM_MARGIN);
    let scale = this.state.scale;
    let tx = this.state.tx;
    let ty = this.state.ty;
    // const minScaleX = (this.state.clientWidth - DIAGRAM_MARGIN) / VIEW_NODE_WIDTH;
    // const maxScaleX = (this.state.clientWidth - DIAGRAM_MARGIN) / (width * 4);
    // const minScaleY = (this.state.clientHeight - DIAGRAM_MARGIN) / VIEW_NODE_HEIGHT;
    // const maxScaleY = (this.state.clientHeight - DIAGRAM_MARGIN) / (height * 4);
    switch(this.state.zoomMode) {
      case ZoomMode.FitToWindow:
        scale = Math.min(scalex, scaley);
        tx = (this.state.clientWidth - (scale * width)) / 2 - this.state.minX;
        ty = (this.state.clientHeight - (scale * height)) / 2 - this.state.minY;
        break;
      case ZoomMode.FitToWindowWidth:
        scale = scalex;
        tx = (this.state.clientWidth - (scale * width)) / 2 - this.state.minX;
        if (height * scale + DIAGRAM_MARGIN > this.state.clientHeight) {
          ty = (DIAGRAM_MARGIN / 2) - this.state.minY;
        } else {
          ty = (this.state.clientHeight - (scale * height)) / 2 - this.state.minY;
        }
        break;
      case ZoomMode.OneToOne:
        scale = 1;
        if (width + DIAGRAM_MARGIN > this.state.clientWidth) {
          tx = (DIAGRAM_MARGIN / 2) - this.state.minX;
        } else {
          tx = (this.state.clientWidth - (scale * width)) / 2 - this.state.minX;
        }
        if (height * scale + DIAGRAM_MARGIN > this.state.clientHeight) {
          ty = (DIAGRAM_MARGIN / 2) - this.state.minY;
        } else {
          ty = (this.state.clientHeight - (scale * height)) / 2 - this.state.minY;
        }
        break;
      case ZoomMode.UserZoom:
      default:
    }
    if (numbersDiffer(this.state.scale, scale)) { this.setState({ scale }) };
    if (numbersDiffer(this.state.tx, tx)) { this.setState({ tx }) };
    if (numbersDiffer(this.state.ty, ty)) { this.setState({ ty }) };            
  }

  private onFitToWindow = () => {
    this.setState({zoomMode: ZoomMode.FitToWindow});
  }

  private onFitToWidth = () => {
    this.setState({zoomMode: ZoomMode.FitToWindowWidth});
  }

  private onOneHundredPercent = () => {
    this.setState({zoomMode: ZoomMode.OneToOne});
  }

  private onZoomIn = () => {
    this.setState({
      scale: this.state.scale * (1 + defaultZoomSpeed),
      zoomMode: ZoomMode.UserZoom,
    })
  }

  private onZoomOut = () => {
    this.setState({
      scale: this.state.scale * (1 - defaultZoomSpeed),
      zoomMode: ZoomMode.UserZoom,
    })
  }

  private onWheel = (e: WheelEvent) => {
    // smoothScroll.cancel()

    const scaleMultiplier = getScaleMultiplier(e.deltaY)

    if (scaleMultiplier !== 1) {
      const offset = this.getOffsetXY(e)
      this.publicZoomTo(offset.x, offset.y, scaleMultiplier)
      e.preventDefault()
    }
  }

  private publicZoomTo(x: number, y: number, scaleMultiplier: number) {
    // smoothScroll.cancel()
    // cancelZoomAnimation()
    return this.zoomByRatio(x, y, scaleMultiplier)
  }

  private zoomByRatio(clientX: number, clientY: number, ratio: number) {
    if (isNaN(clientX) || isNaN(clientY) || isNaN(ratio)) {
      throw new Error('zoom requires valid numbers')
    }

    const newScale = this.state.scale * ratio;

    if (newScale < this.minZoom) {
      if (this.state.scale === this.minZoom) { return; }

      ratio = this.minZoom / this.state.scale;
    }
    if (newScale > this.maxZoom) {
      if (this.state.scale === this.maxZoom) { return; }

      ratio = this.maxZoom / this.state.scale;
    }

    const size = this.transformToScreen(clientX, clientY);

    this.setState({
      tx: size.x - ratio * (size.x - this.state.tx),
      ty: size.y - ratio * (size.y - this.state.ty),
      zoomMode: ZoomMode.UserZoom,
    });

    const transformAdjusted = this.keepTransformInsideBounds();
    if (!transformAdjusted) {
      this.setState({ scale: this.state.scale * ratio });
    }

    // TODO: triggerEvent('zoom')

    this.makeDirty()
  }

  // TODO: Implement for animation
  private makeDirty() {
    // this.isDirty = true
    // this.frameAnimation = window.requestAnimationFrame(this.frame)
  }

  // TODO: Implement me
  private keepTransformInsideBounds(): boolean {
    // const boundingBox = getBoundingBox()
    // if (!boundingBox) return

    const adjusted = false;
    /* 
    var clientRect = getClientRect()

    var diff = boundingBox.left - clientRect.right
    if (diff > 0) {
      transform.x += diff
      adjusted = true
    }
    // check the other side:
    diff = boundingBox.right - clientRect.left
    if (diff < 0) {
      transform.x += diff
      adjusted = true
    }

    // y axis:
    diff = boundingBox.top - clientRect.bottom
    if (diff > 0) {
      // we adjust transform, so that it matches exactly our bounding box:
      // transform.y = boundingBox.top - (boundingBox.height + boundingBox.y) * transform.scale =>
      // transform.y = boundingBox.top - (clientRect.bottom - transform.y) =>
      // transform.y = diff + transform.y =>
      transform.y += diff
      adjusted = true
    }

    diff = boundingBox.bottom - clientRect.top
    if (diff < 0) {
      transform.y += diff
      adjusted = true
    }
    */
    return adjusted
  }

  private transformToScreen(x: number, y: number) {
    const parentCTM = this.owner().getScreenCTM();
    if (parentCTM) {
      const parentScaleX = parentCTM.a;
      const parentScaleY = parentCTM.d;
      const parentOffsetX = parentCTM.e;
      const parentOffsetY = parentCTM.f;
      this.storedCTMResult = new Point(
        x * parentScaleX - parentOffsetX,
        y * parentScaleY - parentOffsetY
      );
    } else {
      this.storedCTMResult = new Point(x, y);
    }
    return this.storedCTMResult;
  }

  private getOffsetXY(e: WheelEvent): IOffset {
    let offsetX: number;
    let offsetY: number;

    // I tried using e.offsetX, but that gives wrong results for svg, when user clicks on a path.
    const ownerRect = this.owner().getBoundingClientRect();
    offsetX = e.clientX - ownerRect.left
    offsetY = e.clientY - ownerRect.top

    return {x: offsetX, y: offsetY};
  }

  private owner(): SVGSVGElement {
    if (this.svgTopGroup.current && this.svgTopGroup.current.ownerSVGElement) {
      return this.svgTopGroup.current.ownerSVGElement;
    } else {
      throw new LogicError("Shouldn't have called owner when this element isn't mounted");
    }
  }

  private onSvgResize = () => {
    this.svgSize();
  }

  private svgSize = () => {
    if (this.svgTopGroup && this.svgTopGroup.current && this.svgTopGroup.current.ownerSVGElement) {
      const svg: SVGSVGElement = this.svgTopGroup.current.ownerSVGElement;
      const clientHeight = svg.clientHeight;
      if (numbersDiffer(clientHeight, this.state.clientHeight)) {
        this.setState({ clientHeight });
      }
      const clientWidth = svg.clientWidth;
      if (numbersDiffer(clientWidth, this.state.clientWidth)) {
        this.setState({ clientWidth });
      }
    }
  }

  private extents = () => {
    if (this.svgTopGroup && this.svgTopGroup.current) {
      const group = this.svgTopGroup.current;
      let rect = {minX: Number.MAX_SAFE_INTEGER, minY: Number.MAX_SAFE_INTEGER, maxX: Number.MIN_SAFE_INTEGER, maxY: Number.MIN_SAFE_INTEGER};
      rect = Array.from(group.querySelectorAll("path,rect,text"))
          .map(e => (e as SVGGraphicsElement).getBBox())
          .reduce((acc, e) => {
              return {
                maxX: Math.max(acc.maxX, e.x + e.width),
                maxY: Math.max(acc.maxY, e.y + e.height),
                minX: Math.min(acc.minX, e.x),
                minY: Math.min(acc.minY, e.y),
              }
            }, rect);
      rect = {
        maxX: rect.maxX,
        maxY: rect.maxY,
        minX: rect.minX,
        minY: rect.minY,
      };
      if (numbersDiffer(this.state.minX, rect.minX)) { this.setState({ minX: rect.minX }); }
      if (numbersDiffer(this.state.maxX, rect.maxX)) { this.setState({ maxX: rect.maxX }); }
      if (numbersDiffer(this.state.minY, rect.minY)) { this.setState({ minY: rect.minY }); }
      if (numbersDiffer(this.state.maxY, rect.maxY)) { this.setState({ maxY: rect.maxY }); }
      return rect;
    } else {
      return undefined;
    }
  }

  private center(): Point {
    return new Point(
      (this.state.maxX - this.state.minX) / 2,
      (this.state.maxY - this.state.minY) / 2
    );
  }

  private viewBox(): SVGRect {
    return new DOMRect(
      this.state.minX,
      this.state.minY,
      this.state.maxY - this.state.minY,
      this.state.maxX - this.state.minX
    );
  }
}

const MIN_DETECTABLE_CHANGE = 0.001;

function numbersDiffer(a: number, b: number): boolean {
  return Math.abs(a - b) > MIN_DETECTABLE_CHANGE;
}

const MOUSE_WHEEL_SPEED = 0.065;

function getScaleMultiplier(delta: number): number {
  let scaleMultiplier = 1
  if (delta > 0) { // zoom out
    scaleMultiplier = (1 - MOUSE_WHEEL_SPEED)
  } else if (delta < 0) { // zoom in
    scaleMultiplier = (1 + MOUSE_WHEEL_SPEED)
  }

  return scaleMultiplier
}
