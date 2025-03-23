import * as MotivationViewNode from "./motivation-view-node";
import * as BaseViewNode from "./base-view-node";
import { useEffect, useState } from "react";
import * as React from "react";

export const ConstraintViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        badge: "#archimate-constraint-badge",
        badgeBounds: MotivationViewNode.badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode),
        entityShape: MotivationViewNode.entityShape,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          badgeBounds: MotivationViewNode.badgeBounds(props.viewNode),
          textBounds: BaseViewNode.textBounds(props.viewNode),
        }));
      }
    }, [props.x, props.y, props.viewNode]);

    return BaseViewNode.render(props, state);
  });

export default ConstraintViewNode;
