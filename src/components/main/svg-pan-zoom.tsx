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

const BOUNDS_PADDING = 0.05;

export default class SvgPanZoom extends React.PureComponent<
  IProps,
  IState
> {
  private minZoom: number = 0;
  private maxZoom: number = Number.POSITIVE_INFINITY;
  private storedCTMResult?: Point;
  private mouseX: number = 0;
  private mouseY: number = 0;

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
      <g onKeyDown={this.onKeyDown} ref={this.props.svgPanZoomRef} transform={`matrix(${this.state.scale}, 0, 0, ${this.state.scale}, ${this.state.tx}, ${this.state.ty})`}>
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
      svg.addEventListener("mousedown", this.onMouseDown);
      wheel.addWheelListener(svg, this.onWheel, true);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    this.extents();
    if ((prevProps.scale !== this.props.scale) && (numbersDiffer(this.props.scale, this.state.scale))) {
      this.setState({ scale: this.props.scale });
    }
    this.calculateTransform();
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onSvgResize);
    if (this.props.svgPanZoomRef.current && this.props.svgPanZoomRef.current.ownerSVGElement) {
      const svg = this.props.svgPanZoomRef.current.ownerSVGElement;
      svg.removeEventListener("mousedown", this.onMouseDown);
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

  private onMouseDown = (e: MouseEvent) => {
    // for IE, left click == 1
    // for Firefox, left click == 0
    const isLeftButton = ((e.button === 1 && window.event !== null) || e.button === 0);
    if (!isLeftButton) { return }

    const offset = this.getOffsetXY(e);
    const point = this.transformToScreen(offset.x, offset.y);
    this.mouseX = point.x;
    this.mouseY = point.y;

    // We need to listen on document itself, since mouse can go outside of the
    // window, and we will loose it
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    return false;
  }

  private onMouseMove = (e: MouseEvent) => {
    const offset = this.getOffsetXY(e);
    const point = this.transformToScreen(offset.x, offset.y);
    const dx = point.x - this.mouseX;
    const dy = point.y - this.mouseY;

    this.mouseX = point.x;
    this.mouseY = point.y;

    this.internalMoveBy(dx, dy);
  }

  private onMouseUp = () => {
    this.releaseDocumentMouse();
  }

  private releaseDocumentMouse = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
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

  private onKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    let x = 0;
    let y = 0;
    let z = 0;
    if (e.keyCode === 38) {
      y = 1; // up
    } else if (e.keyCode === 40) {
      y = -1; // down
    } else if (e.keyCode === 37) {
      x = 1; // left
    } else if (e.keyCode === 39) {
      x = -1; // right
    } else if (e.keyCode === 189 || e.keyCode === 109) { // DASH or SUBTRACT
      z = 1; // `-` -  zoom out
    } else if (e.keyCode === 187 || e.keyCode === 107) { // EQUAL SIGN or ADD
      z = -1; // `=` - zoom in (equal sign on US layout is under `+`)
    }

    if (x || y) {
      e.preventDefault()
      e.stopPropagation()

      const clientRect = this.owner().getBoundingClientRect();
      // movement speed should be the same in both X and Y direction:
      const offset = Math.min(clientRect.width, clientRect.height);
      const moveSpeedRatio = 0.05;
      const dx = offset * moveSpeedRatio * x;
      const dy = offset * moveSpeedRatio * y;

      this.internalMoveBy(dx, dy);
    }

    if (z) {
      const scaleMultiplier = getScaleMultiplier(z);
      const ownerRect = this.owner().getBoundingClientRect();
      this.publicZoomTo(ownerRect.width/2, ownerRect.height/2, scaleMultiplier);
    }
  }

  private moveTo(x: number, y: number) {
    this.setState({
      tx: x,
      ty: y,
    });

    this.keepTransformInsideBounds();
  }

  private moveBy(dx: number, dy: number) {
    this.moveTo(this.state.tx + dx, this.state.ty + dy);
  }

  private internalMoveBy(dx: number, dy: number, smooth?: boolean) {
    return this.moveBy(dx, dy);
  }

  private publicZoomTo(x: number, y: number, scaleMultiplier: number) {
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

    this.keepTransformInsideBounds();
    const scale = this.state.scale * ratio;
    if (numbersDiffer(this.state.scale, scale)) {
      this.setState({ scale });
    }
    this.props.onZoom(scale);
  }

  private keepTransformInsideBounds(): boolean {
    const boundingBox = this.getBoundingBox();

    let adjusted = false;
    const clientRect = this.getClientRect();

    let diff = boundingBox.left - clientRect.right;
    if (diff > 0) {
      this.setState({tx: this.state.tx + diff });
      adjusted = true;
    }
    // check the other side:
    diff = boundingBox.right - clientRect.left;
    if (diff < 0) {
      this.setState({tx: this.state.tx + diff });
      adjusted = true;
    }

    // y axis:
    diff = boundingBox.top - clientRect.bottom;
    if (diff > 0) {
      // we adjust transform, so that it matches exactly our bounding box:
      // this.state.ty = boundingBox.top - (boundingBox.height + boundingBox.y) * this.state.scale =>
      // this.state.ty = boundingBox.top - (clientRect.bottom - this.state.ty) =>
      // this.state.ty = diff + this.state.ty =>
      this.setState({ ty: this.state.ty + diff });
      adjusted = true;
    }

    diff = boundingBox.bottom - clientRect.top;
    if (diff < 0) {
      this.setState({ ty: this.state.ty + diff });
      adjusted = true;
    }

    return adjusted
  }

  private getClientRect() {
    const bbox: SVGRect = this.owner().getBBox();
    const leftTop = this.client(bbox.x, bbox.y);

    return {
      bottom: bbox.height * this.state.scale + leftTop.y,
      left: leftTop.x,
      right: bbox.width * this.state.scale + leftTop.x,
      top: leftTop.y,
    }
  }

  private client(x: number, y: number) {
    return {
      x: (x * this.state.scale) + this.state.tx,
      y: (y * this.state.scale) + this.state.ty,
    }
  }

  /**
   * Returns bounding box that should be used to restrict scene movement.
   */
  private getBoundingBox() {
    const ownerRect = this.owner().getBoundingClientRect();
    const sceneWidth = ownerRect.width
    const sceneHeight = ownerRect.height

    return {
      bottom: sceneHeight * (1 - BOUNDS_PADDING),
      left: sceneWidth * BOUNDS_PADDING,
      right: sceneWidth * (1 - BOUNDS_PADDING),
      top: sceneHeight * BOUNDS_PADDING,
    }
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

  private getOffsetXY(e: MouseEvent | WheelEvent): Point {
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
