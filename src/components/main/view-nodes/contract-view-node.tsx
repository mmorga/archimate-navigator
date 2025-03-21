import { JSX } from "react";
import * as DataObjectViewNode from "./data-object-view-node";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const ContractViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

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
    <g className={backgroundClass}>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
      <rect
        x={bounds.left}
        y={bounds.top + bounds.height - margin}
        width={bounds.width}
        height={margin}
        className="archimate-decoration"
      />
    </g>
  );
}

export default ContractViewNode;
