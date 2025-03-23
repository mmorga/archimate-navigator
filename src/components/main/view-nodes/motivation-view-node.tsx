import { Bounds } from "../../../archimate-model";
import { JSX } from "react";
import { ViewNode } from "@/archimate-model";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";

export const MotivationViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        badgeBounds: badgeBounds(props.viewNode),
        textBounds: BaseViewNode.textBounds(props.viewNode),
        entityShape: entityShape,
      }),
    );

    useEffect(() => {
      if (props.x !== undefined || props.y !== undefined) {
        setState((prevState) => ({
          ...prevState,
          badgeBounds: badgeBounds(props.viewNode),
          textBounds: BaseViewNode.textBounds(props.viewNode),
        }));
      }
    }, [props.x, props.y, props.viewNode]);

    return BaseViewNode.render(props, state);
  });

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const margin = 10;
  const width = bounds.width - margin * 2;
  const height = bounds.height - margin * 2;
  return (
    <path
      d={[
        "M",
        bounds.left + margin,
        bounds.top,
        "h",
        width,
        "l",
        margin,
        margin,
        "v",
        height,
        "l",
        -margin,
        margin,
        "h",
        -width,
        "l",
        -margin,
        -margin,
        "v",
        -height,
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

export function badgeBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  return new Bounds(bounds.right - 25, bounds.top + 5, 20, 20);
}

export default MotivationViewNode;
