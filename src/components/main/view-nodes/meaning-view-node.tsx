import React from "react";
import { Bounds, Point, ViewNode } from "../../../archimate-model";
import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import * as BaseViewNode from "./base-view-node";
import { JSX } from "react";

export default class MeaningViewNode extends React.PureComponent<IViewNodeProps, IViewNodeState> {
  constructor(props: IViewNodeProps) {
    super(props);
    const bounds = new Bounds(
      this.props.x || this.props.viewNode.bounds.left,
      this.props.y || this.props.viewNode.bounds.top,
      this.props.viewNode.bounds.width,
      this.props.viewNode.bounds.height
    );
    this.state = {
      backgroundClass: BaseViewNode.defaultBackgroundClass(this.props.viewNode),
      badge: undefined,
      badgeBounds: undefined,
      bounds,
      entity: this.props.viewNode.entityInstance(),
      margin: 8,
      textAlign: "center",
      textBounds: bounds.reducedBy(2)
    };
  }

  public componentDidUpdate(prevProps: IViewNodeProps) {
    if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
      this.setState({
        badgeBounds: BaseViewNode.badgeBounds(this.props.viewNode),
        textBounds: BaseViewNode.textBounds(this.props.viewNode, this.props.x, this.props.y)
      });
    }
  }

  public render() {
    return (
      <g {...BaseViewNode.groupAttrs(this.props.viewNode, this.props.onClicked)}>
        {BaseViewNode.title(this.props.viewNode)}
        {BaseViewNode.desc(this.props.viewNode)}
        {entityShape(this.props.viewNode, this.state.backgroundClass, BaseViewNode.shapeStyle(this.props.viewNode))}
        {BaseViewNode.entityBadge(this.state.badgeBounds, this.state.badge)}
        {BaseViewNode.entityLabel(this.props.viewNode, this.state.textBounds, this.state.textAlign || "center", this.state.badgeBounds)}
        {BaseViewNode.selectedHighlight(this.props.viewNode, this.props.selected)}
      </g>
    );
  }
}

function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const pts = [
    new Point(
      bounds.left + bounds.width * 0.04,
      bounds.top + bounds.height * 0.5
    ),
    new Point(
      bounds.left + bounds.width * 0.5,
      bounds.top + bounds.height * 0.12
    ),
    new Point(
      bounds.left + bounds.width * 0.94,
      bounds.top + bounds.height * 0.55
    ),
    new Point(
      bounds.left + bounds.width * 0.53,
      bounds.top + bounds.height * 0.87
    )
  ];
  return (
    <path
      d={[
        "M",
        pts[0].x,
        pts[0].y,
        "C",
        pts[0].x - bounds.width * 0.15,
        pts[0].y - bounds.height * 0.32,
        pts[1].x - bounds.width * 0.3,
        pts[1].y - bounds.height * 0.15,
        pts[1].x,
        pts[1].y,
        "C",
        pts[1].x + bounds.width * 0.29,
        pts[1].y - bounds.height * 0.184,
        pts[2].x + bounds.width * 0.204,
        pts[2].y - bounds.height * 0.304,
        pts[2].x,
        pts[2].y,
        "C",
        pts[2].x + bounds.width * 0.028,
        pts[2].y + bounds.height * 0.295,
        pts[3].x + bounds.width * 0.156,
        pts[3].y + bounds.height * 0.088,
        pts[3].x,
        pts[3].y,
        "C",
        pts[3].x - bounds.width * 0.279,
        pts[3].y + bounds.height * 0.326,
        pts[0].x - bounds.width * 0.164,
        pts[0].y + bounds.height * 0.314,
        pts[0].x,
        pts[0].y
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

