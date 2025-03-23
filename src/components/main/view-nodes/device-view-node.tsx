import { Bounds, ViewNode } from "../../../archimate-model";
import { IViewNodeProps, IViewNodeState } from "./base-view-node";
import { JSX } from "react";
import * as BadgedNodeViewNode from "./badged-node-view-node";
import * as BaseViewNode from "./base-view-node";
import { useEffect, useState } from "react";
import * as React from "react";

const DeviceViewNode: React.FC<IViewNodeProps> = React.memo((props) => {
  function badgeTextBounds(props: IViewNodeProps): Partial<IViewNodeState> {
    let badge: string | undefined;
    let badgeBounds: Bounds | undefined;
    let textBounds: Bounds | undefined;
    if (props.viewNode.childType === "1") {
      badge = "#archimate-device-badge";
      badgeBounds = BadgedNodeViewNode.badgeBounds(props.viewNode);
      textBounds = BadgedNodeViewNode.textBounds(props.viewNode);
    } else {
      badge = undefined;
      badgeBounds = undefined;
      textBounds = props.viewNode.absolutePosition().reducedBy(2);
    }
    return {
      badge: badge,
      badgeBounds: badgeBounds,
      textBounds: textBounds,
      entityShape: entityShape,
    };
  }

  const [state, setState] = useState<IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, badgeTextBounds(props)),
  );

  useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState((prevState) => ({
        ...prevState,
        ...badgeTextBounds(props),
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

export default DeviceViewNode;

// export default class DeviceViewNode extends BadgedNodeViewNode {
function path(
  viewNodeBounds: Bounds,
  backgroundClass: string | undefined,
  style: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNodeBounds;
  const margin = 10;
  const decorationPath = [
    "M",
    bounds.left + margin,
    bounds.bottom - margin,
    "l",
    -margin,
    margin,
    "h",
    bounds.width,
    "l",
    -margin,
    -margin,
    "z",
  ].join(" ");

  return (
    <>
      <rect
        x={bounds.left}
        y={bounds.top}
        width={bounds.width}
        height={bounds.height - margin}
        rx={"6"}
        ry={"6"}
        className={backgroundClass}
        style={style}
      />
      <path d={decorationPath} className={backgroundClass} style={style} />
      <path d={decorationPath} className="archimate-decoration" style={style} />
    </>
  );
}

function entityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  if (viewNode.childType === "1") {
    return BadgedNodeViewNode.entityShape(
      viewNode,
      backgroundClass,
      shapeStyle,
    );
  } else {
    return path(viewNode.absolutePosition(), backgroundClass, shapeStyle);
  }
}
