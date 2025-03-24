import { Bounds } from "../../../archimate-model";
import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import * as BaseViewNode from "./base-view-node";
import { JSX, useEffect, useState } from "react";

const ValueViewNode: React.FC<IViewNodeProps> = (props) => {
  const textBounds = (): Bounds => {
    const bounds = new Bounds(
      props.x,
      props.y,
      props.viewNode.bounds.width,
      props.viewNode.bounds.height,
    ).reducedBy(2);
    return new Bounds(
      bounds.left + 10,
      bounds.top + 10,
      bounds.width - 20,
      bounds.height - 20,
    );
  };

  const entityShape = (): JSX.Element => {
    const bounds = props.viewNode.absolutePosition();
    const cx = bounds.left + bounds.width / 2.0;
    const rx = bounds.width / 2.0 - 1;
    const cy = bounds.top + bounds.height / 2.0;
    const ry = bounds.height / 2.0 - 1;
    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className={state.backgroundClass}
        style={{
          fill: props.viewNode.style?.fillColor?.toRGBA(),
          stroke: props.viewNode.style?.lineColor?.toRGBA(),
          strokeWidth: props.viewNode.style?.lineWidth,
        }}
      />
    );
  };

  function calcStateChanges(props: IViewNodeProps) {
    return {
      textBounds: textBounds(),
      bounds: new Bounds(
        props.x || props.viewNode.bounds.left,
        props.y || props.viewNode.bounds.top,
        props.viewNode.bounds.width,
        props.viewNode.bounds.height,
      ),
    };
  }

  const [state, setState] = useState<IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      ...calcStateChanges(props),
      backgroundClass: "archimate-value-background",
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

export default ValueViewNode;
