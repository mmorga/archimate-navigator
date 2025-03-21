import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import { JSX } from "react";
import { ViewNode, Bounds } from "../../../archimate-model";
import * as BadgedNodeViewNode from "./badged-node-view-node";
import * as BaseViewNode from "./base-view-node";
import BadgedRectViewNode from "./badged-rect";
import React, { useEffect, useState } from "react";

const NodeViewNode: React.FC<IViewNodeProps> = React.memo((props) => {

  let badge: string | undefined;
  let badgeBounds: Bounds | undefined;
  if (props.viewNode.childType === "1") {
    badge = "#archimate-node-badge";
    badgeBounds = BadgedNodeViewNode.badgeBounds(props.viewNode);
  }
 
  const [state, setState] = useState<IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      badge: badge,
      badgeBounds: badgeBounds,
      margin: 14,
      textBounds: BadgedNodeViewNode.textBounds(props.viewNode),
      entityShape: entityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        badgeBounds: BadgedNodeViewNode.badgeBounds(props.viewNode),
        textBounds: BadgedNodeViewNode.textBounds(props.viewNode)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  if (viewNode.childType === "1") {
    return BadgedRectViewNode.path(
      viewNode.absolutePosition(),
      backgroundClass,
      shapeStyle
    );
  } else {
    return BadgedNodeViewNode.entityShape(viewNode, backgroundClass, shapeStyle);
  }
}

export default NodeViewNode;
