import { entityShape, IViewNodeProps } from "./base-view-node";
import * as BaseViewNode from "./base-view-node";
import { Bounds } from "../../../archimate-model";
import { useEffect, useState } from "react";

const StickyViewNode: React.FC<IViewNodeProps> = (props) => {
  function calcStateChanges(props: BaseViewNode.IViewNodeProps) {
    return {
      bounds: new Bounds(
        props.x || props.viewNode.bounds.left,
        props.y || props.viewNode.bounds.top,
        props.viewNode.bounds.width,
        props.viewNode.bounds.height,
      ),
      textBounds: new Bounds(
        props.x,
        props.y,
        props.viewNode.bounds.width,
        props.viewNode.bounds.height,
      ).reducedBy(2),
    };
  }

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      ...calcStateChanges(props),
      backgroundClass: "archimate-sticky-background",
      entityShape: entityShape,
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
};

export default StickyViewNode;
