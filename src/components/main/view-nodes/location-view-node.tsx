import React from 'react';
import { IViewNodeProps } from "./default-element";
import * as BaseViewNode from "./base-view-node";
import * as BadgedRect from "./badged-rect";

const LocationViewNode: React.FC<IViewNodeProps> = React.memo((props) => {
  const state = BaseViewNode.initialState(props.viewNode, {
    backgroundClass: "archimate-location-background",
    badge: "#archimate-location-badge",
    badgeBounds: BadgedRect.badgeBounds(props.viewNode),
    entityShape: BadgedRect.entityShape
  });

  return BaseViewNode.render(props, state);
});

export default LocationViewNode;
