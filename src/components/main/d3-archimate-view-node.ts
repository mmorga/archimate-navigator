import "./archimate-svg.css";
import { enterDocumentation } from "./view-nodes/documentation";
import { enterTitle } from "./view-nodes/title";
import { IEntity, ViewNode, zeroBounds } from "../../archimate-model";
import { EnterElement, ValueFn } from "d3-selection";
import { enterSelectedViewNode } from "./view-nodes/selected-view-node";
import { enterEntityLabel, updateEntityLabel } from "./view-nodes/entity-label";
import { entityClickedFunc } from "../common";
import * as d3 from "d3";
import { enterEntityBadge, updateEntityBadge } from "./view-nodes/entity-badge";
import { svgShapeGroup, updateBaseShape } from "./view-nodes/base-shape";

const enterArchimateViewNode = (
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

    const g = viewNodeSvgGroup(viewNode, onClicked);

    enterTitle(g, viewNode.name);

    enterDocumentation(g, viewNode.documentation);

    viewNode.enterEntityShapeFunc(
      svgShapeGroup(g),
      viewNode,
      viewNode.backgroundClass,
      viewNode.shapeStyle(),
    );

    enterEntityBadge(g, viewNode.badgeBounds(viewNode), viewNode.badge);

    enterEntityLabel(
      g,
      viewNode,
      viewNode.textBounds(viewNode, x, y),
      viewNode.textAlign || "center",
      viewNode.badgeBounds(viewNode) || zeroBounds(),
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

export const updateArchimateViewNode = (
  selection: d3.Selection<SVGGElement, ViewNode, SVGGElement, undefined>,
) => {
  // function updateViewNode(this: SVGGElement, vn: ViewNode): SVGGElement {
  updateEntityBadge(selection.select("use"));
  updateEntityLabel(selection);
  updateBaseShape(selection);

  //   return this;
  // }

  // selection.select(updateViewNode);
};

function viewNodeSvgGroup(
  viewNode: ViewNode,
  onClicked: entityClickedFunc,
): SVGGElement {
  const g: SVGGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  g.setAttribute("id", viewNode.id);

  const className =
    viewNode.type && viewNode.type.length > 0
      ? `archimate-${viewNode.elementType()}`
      : undefined;

  if (className) {
    g.setAttribute("class", `node ${className}`);
  }

  // TODO: add drag
  g.onclick = () => {
    onClicked(viewNode.entityInstance());
  };

  return g;
}

export default enterArchimateViewNode;
