import { IViewNodeProps } from "./base-view-node";
import { JSX } from "react";
import { ViewNode } from "../../../archimate-model";
import * as BadgedRect from "./badged-rect";
import * as BaseViewNode from "./base-view-node";
import * as React from "react";

function artifactEntityShape(
  viewNode: ViewNode,
  backgroundClass: string | undefined,
  shapeStyle: React.CSSProperties | undefined,
): JSX.Element {
  const bounds = viewNode.absolutePosition();
  const margin = 18;
  return (
    <g className={backgroundClass} style={shapeStyle}>
      <path
        d={[
          "M",
          bounds.left,
          bounds.top,
          "h",
          bounds.width - margin,
          "l",
          margin,
          margin,
          "v",
          bounds.height - margin,
          "h",
          -bounds.width,
          "z",
        ].join(" ")}
      />
      <path
        d={[
          "M",
          bounds.right - margin,
          bounds.top,
          "v",
          margin,
          "h",
          margin,
          "z",
        ].join(" ")}
        className="archimate-decoration"
      />
    </g>
  );
}

const ArtifactViewNode: React.FC<IViewNodeProps> = React.memo((props) => {
  const state = BaseViewNode.initialState(props.viewNode, {
    badge: "archimate-artifact-badge",
    badgeBounds: BadgedRect.badgeBounds(props.viewNode),
    entityShape: artifactEntityShape,
  });

  return BaseViewNode.render(props, state);
});

export default ArtifactViewNode;
