import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import { JSX } from "react";
import { Point, ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

const MeaningViewNode: React.FC<IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      entityShape: meaningEntityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        badgeBounds: BaseViewNode.badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode, props.x, props.y)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

function meaningEntityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
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

export default MeaningViewNode;
