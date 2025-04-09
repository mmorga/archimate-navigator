import "./archimate-svg.css";
import {
  elementTypeLayer,
  elementTypeOfString,
  layerClassName,
  ViewNode,
  zeroBounds,
} from "../../archimate-model";
import { useEffect, useState } from "react";
import { entityClickedFunc } from "../common";
import BaseShape, { defaultTextBounds } from "./view-nodes/base-shape";
import Documentation from "./view-nodes/documentation";
import archimateElementTypeProps, {
  IArchimateViewNodeState,
} from "./view-nodes/archimate-element-type-props";
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

  const archimateViewNodeState: IArchimateViewNodeState = {
    badge: undefined,
    backgroundClass: layerClassName(
      elementTypeLayer(elementTypeOfString(viewNode.elementType())),
    ),
    entity: viewNode.entityInstance(),
    textAlign: "center",
    badgeBounds: zeroBounds,
    textBounds: defaultTextBounds,
    EntityShape: BaseShape,
    ...archimateElementTypeProps(viewNode),
  };

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
      <archimateViewNodeState.EntityShape
        viewNode={viewNode}
        backgroundClass={archimateViewNodeState.backgroundClass}
        shapeStyle={viewNode.shapeStyle()}
      />
      {/* {archimateViewNodeState.EntityShape({
        viewNode: viewNode,
        backgroundClass: archimateViewNodeState.backgroundClass,
        shapeStyle: viewNode.shapeStyle(),
      }
      )} */}
      <EntityBadge
        bounds={archimateViewNodeState.badgeBounds(viewNode)}
        badge={archimateViewNodeState.badge}
      />
      <EntityLabel
        viewNode={viewNode}
        textBounds={archimateViewNodeState.textBounds(viewNode, x, y)}
        textAlign={archimateViewNodeState.textAlign || "center"}
        badgeBounds={
          archimateViewNodeState.badgeBounds(viewNode) || zeroBounds()
        }
      />
      <SelectedViewNode
        bounds={viewNode.absolutePosition()}
        selected={selected}
      />
    </g>
  );
};
