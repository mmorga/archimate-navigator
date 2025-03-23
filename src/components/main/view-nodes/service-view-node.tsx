import { Bounds, zeroBounds } from "@/archimate-model";
import { ViewNode } from "@/archimate-model";
import * as BadgedRoundedRectViewNode from "./badged-rounded-rect";
import * as BaseViewNode from "./base-view-node";
import React, { useEffect, useState } from "react";
import { JSX } from "react";

export const ServiceViewNode: React.FC<BaseViewNode.IViewNodeProps> =
  React.memo((props) => {
    function calcStateChanges(props: BaseViewNode.IViewNodeProps) {
      if (props.viewNode.childType === "1") {
        return {
          badgeBounds: zeroBounds(),
          textBounds: textBounds(props.viewNode),
        };
      } else {
        return {
          badge: "#archimate-service-badge",
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

export default ServiceViewNode;

function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return servicePath(viewNode, backgroundClass, shapeStyle);
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
  return new Bounds(
    bounds.left + 7,
    bounds.top + 5,
    bounds.width - 14,
    bounds.height - 10,
  );
}

function servicePath(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  return (
    <rect
      x={bounds.left}
      y={bounds.top}
      width={bounds.width}
      height={bounds.height}
      rx={bounds.height / 2.0}
      ry={bounds.height / 2.0}
      className={backgroundClass}
      style={shapeStyle}
    />
  );
}
