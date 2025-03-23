import { JSX } from "react";
import * as GroupViewNode from "./group-view-node";
import { ViewNode } from "../../../archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const GroupingViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        backgroundClass: "archimate-grouping-background",
        textAlign: "left",
        textBounds: GroupViewNode.textBounds(props.viewNode),
        entityShape: entityShape,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          textBounds: GroupViewNode.textBounds(props.viewNode),
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
  const groupHeaderHeight = 21;
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
      <path
        d={[
          "M",
          bounds.left,
          bounds.top + groupHeaderHeight - 1,
          "v",
          -(groupHeaderHeight - 1),
          "h",
          bounds.width / 2,
          "v",
          groupHeaderHeight - 1,
        ].join(" ")}
        className={backgroundClass}
        style={shapeStyle}
      />
    </>
  );
}

export default GroupingViewNode;
