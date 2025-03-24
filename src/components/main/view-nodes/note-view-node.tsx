import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import * as BaseViewNode from "./base-view-node";
import { JSX, useEffect, useState } from "react";
import { Bounds } from "../../../archimate-model";

const NoteViewNode: React.FC<IViewNodeProps> = (props) => {
  const entityShape = (): JSX.Element => {
    const bounds = props.viewNode.absolutePosition();
    return (
      <path
        d={[
          "m",
          bounds.left,
          bounds.top,
          "h",
          bounds.width,
          "v",
          bounds.height - 8,
          "l",
          -8,
          8,
          "h",
          -(bounds.width - 8),
          "z",
        ].join(" ")}
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
      textBounds: props.viewNode.absolutePosition().reducedBy(3),
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
      backgroundClass: "archimate-note-background",
      textAlign: "left",
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

export default NoteViewNode;
