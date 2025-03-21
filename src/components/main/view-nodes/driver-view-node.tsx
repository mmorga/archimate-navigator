import * as MotivationViewNode from "./motivation-view-node";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const DriverViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      badge: "#archimate-driver-badge",
      badgeBounds: MotivationViewNode.badgeBounds(props.viewNode),
      textBounds: BaseViewNode.textBounds(props.viewNode),
      entityShape: MotivationViewNode.entityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        badgeBounds: MotivationViewNode.badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

export default DriverViewNode;
