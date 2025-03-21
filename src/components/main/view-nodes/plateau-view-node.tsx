import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import * as BadgedNodeViewNode from "./badged-node-view-node";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

const PlateauViewNode: React.FC<IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      backgroundClass: "archimate-implementation2-background",
      badge: "#archimate-plateau-badge",
      entityShape: BadgedNodeViewNode.entityShape
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

export default PlateauViewNode;
