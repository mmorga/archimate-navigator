import { ViewNode } from "@/archimate-model";
import { JSX } from "react";
import * as BaseViewNode from "./base-view-node";
import { useEffect, useState } from "react";
import * as React from "react";

export const JunctionViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        backgroundClass: "archimate-junction-background",
        textBounds: BaseViewNode.textBounds(props.viewNode),
        entityShape: entityShape,
        entityLabel: entityLabel,
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

export function entityLabel() {
  return undefined;
}

export function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const center = bounds.center();
  const r = Math.min(bounds.width, bounds.height) / 2;
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={r}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}

export default JunctionViewNode;
