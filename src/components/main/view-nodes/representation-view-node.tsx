import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import * as DataObjectViewNode from "./data-object-view-node";
import React, { useEffect, useState } from "react";

export const RepresentationViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      textBounds: DataObjectViewNode.textBounds(props.viewNode, props.x, props.y),
      entityShape: entityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        textBounds: DataObjectViewNode.textBounds(props.viewNode, props.x, props.y)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const margin = 8;
  return (
    <>
      <path
        d={[
          "M",
          bounds.left,
          bounds.top,
          "v",
          bounds.height - 8,
          "c",
          0.167 * bounds.width,
          0.133 * bounds.height,
          0.336 * bounds.width,
          0.133 * bounds.height,
          bounds.width * 0.508,
          0,
          "c",
          0.0161 * bounds.width,
          -0.0778 * bounds.height,
          0.322 * bounds.width,
          -0.0778 * bounds.height,
          bounds.width * 0.475,
          0,
          "v",
          -(bounds.height - 8),
          "z"
        ].join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        key="data-decoration"
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
    </>
  );
}

export default RepresentationViewNode;
