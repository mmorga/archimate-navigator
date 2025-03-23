import { Bounds, zeroBounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";
import { JSX } from "react";

export const ProcessViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    function calcStateChanges(props: BaseViewNode.IViewNodeProps) {
      if (props.viewNode.childType === "1") {
        return {
          badgeBounds: zeroBounds(),
          textBounds: textBounds(props.viewNode),
        };
      } else {
        return {
          badge: "#archimate-process-badge",
          badgeBounds: BadgedRoundedRectViewNode.badgeBounds(props.viewNode),
          textBounds: BaseViewNode.textBounds(props.viewNode),
        };
      }
    }

    const [state, setState] = useState<BaseViewNode.IViewNodeState>(
      BaseViewNode.initialState(props.viewNode, {
        ...calcStateChanges(props),
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
  });

export default ProcessViewNode;

function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return processPath(viewNode, backgroundClass, shapeStyle);
  } else {
    return BadgedRoundedRectViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  }
}

function textBounds(viewNode: ViewNode): Bounds {
  const bounds = viewNode.absolutePosition();
  const shaftTop = bounds.top + bounds.height * 0.15;
  const shaftBottom = bounds.bottom - bounds.height * 0.15;
  const left = bounds.left;
  const textBounds = new Bounds(
    left,
    shaftTop,
    bounds.width - bounds.height * 0.25,
    shaftBottom - shaftTop,
  );
  return textBounds.reducedBy(2);
}

function processPath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const top = bounds.top;
  const shaftTop = bounds.top + bounds.height * 0.15;
  const middle = bounds.top + bounds.height * 0.5;
  const shaftBottom = bounds.bottom - bounds.height * 0.15;
  const bottom = bounds.bottom;

  const left = bounds.left;
  const arrowBack = bounds.right - bounds.height * 0.5;
  const right = bounds.right;
  return (
    <path
      d={[
        "M",
        left,
        shaftTop,
        "L",
        arrowBack,
        shaftTop,
        "L",
        arrowBack,
        top,
        "L",
        right,
        middle,
        "L",
        arrowBack,
        bottom,
        "L",
        arrowBack,
        shaftBottom,
        "L",
        left,
        shaftBottom,
        "z",
      ].join(" ")}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}
