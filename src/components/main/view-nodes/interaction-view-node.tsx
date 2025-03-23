import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const InteractionViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    function calcStateChanges(props: BaseViewNode.IViewNodeProps) {
      return {
        badge: "#archimate-interaction-badge",
        badgeBounds: BadgedRoundedRectViewNode.badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode),
      };
    }

    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        ...calcStateChanges(props),
        entityShape: BadgedRoundedRectViewNode.entityShape,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          ...calcStateChanges(props),
        }));
      }
    }, [props.x, props.y, props.viewNode]);

    return BaseViewNode.render(props, state);
  });

export default InteractionViewNode;
