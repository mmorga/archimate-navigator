import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import * as DataObjectViewNode from "./data-object-view-node";
import { useEffect, useState } from "react";
import * as React from "react";

export const ProductViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        margin: 8,
        textBounds: DataObjectViewNode.textBounds(
          props.viewNode,
          props.x,
          props.y,
        ),
        entityShape: entityShape,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          textBounds: DataObjectViewNode.textBounds(
            props.viewNode,
            props.x,
            props.y,
          ),
        }));
      }
    }, [props.x, props.y, props.viewNode]);

    return BaseViewNode.render(props, state);
  });

function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
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
        width={bounds.width / 2.0}
        height="8"
        className="archimate-decoration"
      />
    </g>
  );
}

export default ProductViewNode;
