import * as JunctionViewNode from "./junction";
import * as BaseViewNode from "./base-view-node";
import { useEffect, useState } from "react";
import * as React from "react";

export const OrJunctionViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        backgroundClass: "archimate-or-junction-background",
        textBounds: BaseViewNode.textBounds(props.viewNode),
        entityShape: JunctionViewNode.entityShape,
        entityLabel: JunctionViewNode.entityLabel,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          textBounds: BaseViewNode.textBounds(props.viewNode),
        }));
      }
    }, [props.x, props.y, props.viewNode]);

    return BaseViewNode.render(props, state);
  });

export default OrJunctionViewNode;
