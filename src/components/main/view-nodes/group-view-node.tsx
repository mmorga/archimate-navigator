import { Bounds } from "../../../archimate-model";
import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const GroupViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      backgroundClass: "archimate-group-background",
      textAlign: "left",
      textBounds: textBounds(props.viewNode),
      entityShape: entityShape
    }));

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        textBounds: textBounds(props.viewNode)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

const groupHeaderHeight = 21;

function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top + groupHeaderHeight}
        width={bounds.width}
        height={bounds.height - groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width / 2.0}
        height={groupHeaderHeight}
        className={"archimate-decoration"}
      />
      )
    </>
  );
}

export function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(
    bounds.left + 3,
    bounds.top,
    bounds.width / 2.0 - 6,
    groupHeaderHeight
  );
}

export default GroupViewNode;
