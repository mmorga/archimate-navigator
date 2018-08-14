import * as React from "react";
import * as wheel from "wheel";
import {
  LogicError,
  Point,
} from "../../archimate-model";

interface IProps {
  onExtentsChange: (minX: number, maxX: number, minY: number, maxY: number) => void;
  onZoom: (scale: number) => void;
  scale: number;
  svgPanZoomRef: React.RefObject<SVGGElement>;
  zoomMode: ZoomMode;
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
}

const DIAGRAM_MARGIN = 24;

const MOUSE_WHEEL_SPEED = 0.065;

export default class SvgPanZoom extends React.PureComponent<
  IProps,
  IState
> {
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
      scale: props.scale,
      tx: 0,
      ty: 0,
    };
  }

  public render() {
    return (
      <g ref={this.props.svgPanZoomRef} transform={`matrix(${this.state.scale}, 0, 0, ${this.state.scale}, ${this.state.tx}, ${this.state.ty})`}>
        {this.props.children}
      </g>
    );
  }

  public componentDidMount() {
    window.addEventListener("resize", this.onSvgResize);
    this.svgSize();
    this.extents();
    if (this.props.svgPanZoomRef.current && this.props.svgPanZoomRef.current.ownerSVGElement) {
      const svg = this.props.svgPanZoomRef.current.ownerSVGElement;
      wheel.addWheelListener(svg, this.onWheel);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    this.extents();
    this.calculateTransform();
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onSvgResize);
    if (this.props.svgPanZoomRef.current && this.props.svgPanZoomRef.current.ownerSVGElement) {
      const svg = this.props.svgPanZoomRef.current.ownerSVGElement;
      wheel.removeWheelListener(svg, this.onWheel);
    }
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
    switch(this.props.zoomMode) {
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
    if (numbersDiffer(this.state.scale, scale)) { this.setState({scale}); this.props.onZoom(scale) };
    if (numbersDiffer(this.state.tx, tx)) { this.setState({ tx }) };
    if (numbersDiffer(this.state.ty, ty)) { this.setState({ ty }) };            
  }

  private onWheel = (e: WheelEvent) => {
    // smoothScroll.cancel()

    const scaleMultiplier = getScaleMultiplier(e.deltaY)

    if (scaleMultiplier !== 1) {
      this.props.onZoom(scaleMultiplier);
      const offset = this.getOffsetXY(e)
      this.publicZoomTo(offset.x, offset.y, scaleMultiplier)
      // e.preventDefault()
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
    });

    const transformAdjusted = this.keepTransformInsideBounds();
    const scale = this.state.scale * ratio;
    if (!transformAdjusted) {
      if (numbersDiffer(this.state.scale, scale)) {
        this.setState({ scale });
      }
    }
    this.props.onZoom(scale);
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

  private getOffsetXY(e: WheelEvent): Point {
    let offsetX: number;
    let offsetY: number;

    const ownerRect = this.owner().getBoundingClientRect();
    offsetX = e.clientX - ownerRect.left
    offsetY = e.clientY - ownerRect.top

    return new Point(offsetX, offsetY);
  }

  private owner(): SVGSVGElement {
    if (this.props.svgPanZoomRef.current && this.props.svgPanZoomRef.current.ownerSVGElement) {
      return this.props.svgPanZoomRef.current.ownerSVGElement;
    } else {
      throw new LogicError("Shouldn't have called owner when this element isn't mounted");
    }
  }

  private onSvgResize = () => {
    this.svgSize();
  }

  private svgSize = () => {
    if (this.props.svgPanZoomRef && this.props.svgPanZoomRef.current && this.props.svgPanZoomRef.current.ownerSVGElement) {
      const svg: SVGSVGElement = this.props.svgPanZoomRef.current.ownerSVGElement;
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
    if (this.props.svgPanZoomRef && this.props.svgPanZoomRef.current) {
      const group = this.props.svgPanZoomRef.current;
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
      if ((numbersDiffer(this.state.minX, rect.minX)) ||
          (numbersDiffer(this.state.maxX, rect.maxX)) ||
          (numbersDiffer(this.state.minY, rect.minY)) ||
          (numbersDiffer(this.state.maxY, rect.maxY))) { 
        this.setState({
          maxX: rect.maxX,
          maxY: rect.maxY,
          minX: rect.minX,
          minY: rect.minY, 
        });
        this.props.onExtentsChange(rect.minX, rect.maxX, rect.minY, rect.maxY);
      }
      return rect;
    } else {
      return undefined;
    }
  }
}

const MIN_DETECTABLE_CHANGE = 0.001;

function numbersDiffer(a: number, b: number): boolean {
  return Math.abs(a - b) > MIN_DETECTABLE_CHANGE;
}

function getScaleMultiplier(delta: number): number {
  let scaleMultiplier = 1
  if (delta > 0) { // zoom out
    scaleMultiplier = (1 - MOUSE_WHEEL_SPEED)
  } else if (delta < 0) { // zoom in
    scaleMultiplier = (1 + MOUSE_WHEEL_SPEED)
  }

  return scaleMultiplier
}

export function zoomIn(scale: number): number {
  return scale * (1 + MOUSE_WHEEL_SPEED);
}

export function zoomOut(scale: number): number {
  return scale * (1 - MOUSE_WHEEL_SPEED);
}
