import { Bounds } from "../../../archimate-model";
import * as DeliverableViewNode from "./deliverable-view-node";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const GapViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      backgroundClass: "archimate-implementation2-background",
      badge: "#archimate-gap-badge",
      badgeBounds: badgeBounds(props.viewNode),
      textBounds: BaseViewNode.textBounds(props.viewNode, props.x, props.y),
      entityShape: DeliverableViewNode.entityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        badgeBounds: badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode, props.x, props.y)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

function badgeBounds(viewNode: ViewNode): Bounds | undefined {
  return new Bounds(
    viewNode.absolutePosition().right - 25,
    viewNode.absolutePosition().top + 5,
    20,
    20
  );
}

export default GapViewNode;
