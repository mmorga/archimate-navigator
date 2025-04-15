import "./archimate-svg.css";
import { enterDocumentation } from "./view-nodes/documentation";
import { enterTitle } from "./view-nodes/title";
import {
  elementTypeLayer,
  elementTypeOfString,
  IEntity,
  layerClassName,
  ViewNode,
  zeroBounds,
} from "../../archimate-model";
import { EnterElement, ValueFn } from "d3-selection";
import { enterSelectedViewNode } from "./view-nodes/selected-view-node";
import { enterEntityLabel } from "./view-nodes/entity-label";
import { entityClickedFunc } from "../common";
import * as d3 from "d3";
import archimateElementTypeProps, {
  IArchimateViewNodeState,
} from "./view-nodes/archimate-element-type-props";
import BaseShape, {
  defaultTextBounds,
  enterBaseShape,
} from "./view-nodes/base-shape";
import { d3EntityBadge } from "./view-nodes/entity-badge";

export const enterArchimateViewNode = (
  onClicked: entityClickedFunc,
  selectedEntity: IEntity | undefined,
  selection: d3.Selection<EnterElement, ViewNode, SVGGElement, undefined>,
) => {
  const enterFunc: ValueFn<EnterElement, ViewNode, SVGGElement> = (
    viewNode: ViewNode,
  ) => {
    const bounds = viewNode.absolutePosition();
    const x = viewNode.x || viewNode.bounds.left;
    const y = viewNode.y || viewNode.bounds.top;

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
      enterEntityShapeFunc: enterBaseShape,
      ...archimateElementTypeProps(viewNode),
    };

    const className =
      viewNode.type && viewNode.type.length > 0
        ? `archimate-${viewNode.elementType()}`
        : undefined;

    const g: SVGGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    g.setAttribute("id", viewNode.id);
    g.setAttribute("class", `node ${className}`);
    // TODO: add drag
    g.onclick = () => {
      onClicked(viewNode.entityInstance());
    };

    const title = enterTitle(viewNode.name);
    if (title) {
      g.appendChild(title);
    }

    const desc = enterDocumentation(viewNode.documentation);
    if (desc) {
      g.appendChild(desc);
    }

    archimateViewNodeState.enterEntityShapeFunc(
      g,
      viewNode,
      archimateViewNodeState.backgroundClass,
      viewNode.shapeStyle(),
    );

    const badge = d3EntityBadge(
      archimateViewNodeState.badgeBounds(viewNode),
      archimateViewNodeState.badge,
    );
    if (badge) {
      g.appendChild(badge);
    }

    enterEntityLabel(
      g,
      viewNode,
      archimateViewNodeState.textBounds(viewNode, x, y),
      archimateViewNodeState.textAlign || "center",
      archimateViewNodeState.badgeBounds(viewNode) || zeroBounds(),
    );

    if (
      selectedEntity &&
      viewNode &&
      viewNode.entityInstance()?.id == selectedEntity.id
    ) {
      enterSelectedViewNode(g, bounds);
    }

    return g;
  };

  selection.append(enterFunc);
};

// const updateArchimateViewNode = (
//   selection: d3.Selection<SVGGElement, ViewNode, SVGGElement, undefined>,
// ) => {
//   const enterFunc: ValueFn<EnterElement, ViewNode, SVGGElement> = (
//     viewNode: ViewNode,
//   ) => {
//     const bounds = viewNode.absolutePosition();
//     const x = viewNode.x || viewNode.bounds.left;
//     const y = viewNode.y || viewNode.bounds.top;

//     const archimateViewNodeState: IArchimateViewNodeState = {
//       badge: undefined,
//       backgroundClass: layerClassName(
//         elementTypeLayer(elementTypeOfString(viewNode.elementType())),
//       ),
//       entity: viewNode.entityInstance(),
//       textAlign: "center",
//       badgeBounds: zeroBounds,
//       textBounds: defaultTextBounds,
//       EntityShape: BaseShape,
//       enterEntityShapeFunc: enterBaseShape,
//       ...archimateElementTypeProps(viewNode),
//     };

//     const g: SVGGElement = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "g",
//     );

//     archimateViewNodeState.enterEntityShapeFunc(
//       g,
//       viewNode,
//       archimateViewNodeState.backgroundClass,
//       viewNode.shapeStyle(),
//     );

//     const badge = d3EntityBadge(
//       archimateViewNodeState.badgeBounds(viewNode),
//       archimateViewNodeState.badge,
//     );
//     if (badge) {
//       g.appendChild(badge);
//     }

//     enterEntityLabel(
//       g,
//       viewNode,
//       archimateViewNodeState.textBounds(viewNode, x, y),
//       archimateViewNodeState.textAlign || "center",
//       archimateViewNodeState.badgeBounds(viewNode) || zeroBounds(),
//     );

//     if (
//       selectedEntity &&
//       viewNode &&
//       viewNode.entityInstance()?.id == selectedEntity.id
//     ) {
//       enterSelectedViewNode(g, bounds);
//     }

//     return g;
//   };

//   selection.append(enterFunc);
// };

export default enterArchimateViewNode;
