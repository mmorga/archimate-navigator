import React from 'react';
import { IViewNodeProps } from "./default-element";
import * as BaseViewNode from "./base-view-node";
import * as BadgedRect from "./badged-rect";
import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";

function elipsePath(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <ellipse
      cx={bounds.left + bounds.width / 2.0}
      cy={bounds.top + bounds.height / 2.0}
      rx={bounds.width / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

function interfaceEntityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  if (viewNode.childType === "1") {
    return elipsePath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRect.entityShape(viewNode, backgroundClass, shapeStyle);
  }
}

const InterfaceViewNode: React.FC<IViewNodeProps> = React.memo((props) => {
  const badge = props.viewNode.childType === "1" ? undefined : "#archimate-interface-badge";
  const badgeBounds = props.viewNode.childType === "1" ? undefined : BadgedRect.badgeBounds(props.viewNode);

  const state = BaseViewNode.initialState(props.viewNode, {
    badge,
    badgeBounds,
    entityShape: interfaceEntityShape
  });

  return BaseViewNode.render(props, state);
});

export default InterfaceViewNode;
