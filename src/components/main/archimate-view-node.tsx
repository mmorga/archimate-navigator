import "./archimate-svg.css";
import { ViewNode, zeroBounds } from "../../archimate-model";
import { useEffect, useState } from "react";
import { entityClickedFunc } from "../common";
import Documentation from "./view-nodes/documentation";
import EntityBadge from "./view-nodes/entity-badge";
import EntityLabel from "./view-nodes/entity-label";
import SelectedViewNode from "./view-nodes/selected-view-node";
import Title from "./view-nodes/title";

type IArchimateViewNodeProps = {
  viewNode: ViewNode;
  onClicked: entityClickedFunc;
  selected: boolean;
  x: number;
  y: number;
};

export const ArchimateViewNode = ({
  viewNode,
  onClicked,
  selected,
  x,
  y,
}: IArchimateViewNodeProps) => {
  const [bounds, setBounds] = useState(viewNode.absolutePosition());

  const className =
    viewNode.type && viewNode.type.length > 0
      ? `archimate-${viewNode.elementType()}`
      : undefined;

  useEffect(() => {
    const curBounds = viewNode.absolutePosition();
    if (!bounds.equals(curBounds)) {
      setBounds(curBounds);
    }
  }, [bounds, viewNode]);

  return (
    <g
      id={viewNode.id}
      className={className}
      onClick={() => onClicked(viewNode.entityInstance())}
    >
      <Title name={viewNode.name} />
      <Documentation documentation={viewNode.documentation} />
      <viewNode.EntityShape
        viewNode={viewNode}
        backgroundClass={viewNode.backgroundClass}
        shapeStyle={viewNode.shapeStyle()}
      />
      <EntityBadge
        bounds={viewNode.badgeBounds(viewNode)}
        badge={viewNode.badge}
      />
      <EntityLabel
        viewNode={viewNode}
        textBounds={viewNode.textBounds(viewNode, x, y)}
        textAlign={viewNode.textAlign || "center"}
        badgeBounds={viewNode.badgeBounds(viewNode) || zeroBounds()}
      />
      <SelectedViewNode
        bounds={viewNode.absolutePosition()}
        selected={selected}
      />
    </g>
  );
};
