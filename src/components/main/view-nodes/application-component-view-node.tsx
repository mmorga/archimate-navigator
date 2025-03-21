import { Bounds, ViewNode } from "../../../archimate-model";
import { JSX } from "react";
import React, { useState } from "react";
import * as BadgedRect from "./badged-rect";
import * as BaseViewNode from "./base-view-node";

export const ApplicationComponentViewNode: React.FC<BaseViewNode.IViewNodeProps> = React.memo((props) => {

  function calcStateChanges(props: BaseViewNode.IViewNodeProps) {
    const badge = props.viewNode.childType === "1" ? "#archimate-app-component-badge" : undefined;
    const badgeBounds = props.viewNode.childType === "1" ? BadgedRect.badgeBounds(props.viewNode) : undefined;
    return {
      badge,
      badgeBounds,
      textBounds: textBounds(props.viewNode)
    };
  }

  const [state, setState] = useState<BaseViewNode.IViewNodeState>(
    BaseViewNode.initialState(props.viewNode, {
      ...calcStateChanges(props),
      entityShape: entityShape
    }));

  React.useEffect(() => {
    if (props.x !== undefined || props.y !== undefined) {
      setState(prevState => ({
        ...prevState,
        ...calcStateChanges(props)
      }));
    }
  }, [props.x, props.y, props.viewNode]);

  return BaseViewNode.render(props, state);
});

export default ApplicationComponentViewNode;

function textBounds(viewNode: ViewNode): Bounds {
  if (viewNode.childType === "1") {
    return BaseViewNode.textBounds(viewNode);
  } else {
    const bounds = viewNode.absolutePosition();
    const mainBoxX = bounds.left + 21.0 / 2;
    return new Bounds(
      mainBoxX + 21 / 2,
      bounds.top + 1,
      bounds.width - 22,
      bounds.height - 2
    );
  }
}

function entityShape(viewNode: ViewNode, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined): JSX.Element {
  if (viewNode.childType === "1") {
    return BadgedRect.entityShape(viewNode, backgroundClass, shapeStyle);
  } else {
    const bounds = viewNode.absolutePosition();
    const mainBoxX = bounds.left + 21.0 / 2;
    const mainBoxWidth = bounds.width - 21 / 2;
    return (
      <>
        <rect
          x={mainBoxX}
          y={bounds.top}
          width={mainBoxWidth}
          height={bounds.height}
          className={backgroundClass}
          style={shapeStyle}
        />
        {componentDecoration(bounds.left, bounds.top + 10, backgroundClass, shapeStyle)}
        {componentDecoration(bounds.left, bounds.top + 30, backgroundClass, shapeStyle)}
      </>
    );
  }
}

function componentDecoration(left: number, top: number, backgroundClass: string | undefined, shapeStyle: React.CSSProperties | undefined) {
  return (
    <>
      <rect
        x={left}
        y={top}
        width="21"
        height="13"
        className={backgroundClass}
        style={shapeStyle}
      />
      <rect
        x={left}
        y={top}
        width="21"
        height="13"
        className="archimate-decoration"
      />
    </>
  );
}
