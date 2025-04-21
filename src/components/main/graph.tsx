import {
  Connection,
  IEntity,
  VIEW_NODE_WIDTH,
  ViewNode,
} from "../../archimate-model";
import { useEffect, useRef } from "react";
import { BaseType, select, ValueFn } from "d3-selection";
import * as d3 from "d3";
import * as d3force from "d3-force";
import {
  enterArchimateViewNode,
  updateArchimateViewNode,
} from "./d3-archimate-view-node";
import { entityClickedFunc } from "../common";

const DEFAULT_DISTANCE = 30; // Default distance for D3 Force simulations

const adjustLinkDistance = (d: Connection): number => {
  const rel = d.entityInstance();
  const relType = rel ? rel.type : "";
  const dist = (x: number) => (DEFAULT_DISTANCE * x) / 100;
  switch (relType) {
    case "Influence":
      return dist(200);
    case "Access":
      return dist(150);
    case "Serving":
      return dist(120);
    case "Realization":
      return dist(100);
    case "Assignment":
      return dist(80);
    case "Aggregation":
      return dist(60);
    case "Composition":
      return dist(50);
    default:
      return dist(100);
  }
};

// const enterNode = (selection: d3.Selection<EnterElement, ViewNode, SVGElement, undefined>) => {
//   const g = selection.append('g');
//   g.classed('node', true);

//   g.append('circle')
//     .attr("r", VIEW_NODE_WIDTH)
//     .attr("fill", "none") // (d) => d.size)
//     .style("stroke", "red");
//     // .call(force.drag);

//   g.append('text')
//     .attr("x", 0) // (d) => d.size + 5)
//     .attr("dy", ".35em")
//     .text((d) => d.id);
// };

// const updateNode = (
//   selection: d3.Selection<SVGGElement, ViewNode, SVGGElement, undefined>,
// ) => {
//   // selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
//   console.log("updateNode: ", selection);
// };

const enterLink = (
  selection: d3.Selection<SVGLineElement, Connection, SVGGElement, undefined>,
) => {
  selection.classed("link", true).attr("stroke-width", 1.0); //(d) => d.size);
};

const updateLink = (
  selection: d3.Selection<SVGLineElement, Connection, SVGGElement, undefined>,
) => {
  selection
    .attr("x1", (d) => d.startLocation().x) // d.source.x)
    .attr("y1", (d) => d.startLocation().y)
    .attr("x2", (d) => d.endLocation().x)
    .attr("y2", (d) => d.endLocation().y);
};

const updateGraph = (
  selection: d3.Selection<SVGGElement, undefined, null, undefined>,
) => {
  selection
    .selectAll<SVGGElement, ViewNode>(".node")
    .call(updateArchimateViewNode);
  selection.selectAll<SVGLineElement, Connection>(".link").call(updateLink);
};

const nodeKey: ValueFn<BaseType, ViewNode, string> = (e) => {
  return e.id;
};

const Graph = ({
  nodes,
  links,
  onForceLayoutTick,
  autoLayout,
  selectedEntity,
  entityClicked,
}: {
  nodes: ViewNode[];
  links: Connection[];
  onForceLayoutTick: () => void;
  autoLayout: boolean;
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
}) => {
  const gRef = useRef(null);

  const forceLink = d3force
    .forceLink<ViewNode, Connection>(links)
    .id((node: ViewNode) => node.id)
    .distance(adjustLinkDistance);
  const force = d3force
    .forceSimulation<ViewNode, Connection>(nodes)
    .force("center", d3force.forceCenter(0, 0))
    .force("collide", d3force.forceCollide(VIEW_NODE_WIDTH))
    .force("link", forceLink)
    .force("charge", d3force.forceManyBody());

  useEffect(() => {
    if (gRef.current) {
      const d3Graph = select<SVGGElement, undefined>(
        gRef.current as SVGGElement,
      );
      if (autoLayout) {
        force.on("tick", () => {
          // after force calculation starts, call updateGraph
          // which uses d3 to manipulate the attributes,
          // and React doesn't have to go through lifecycle on each tick
          d3Graph.call(updateGraph);
          if (!autoLayout) {
            onForceLayoutTick();
          }
        });
      }

      const d3Nodes = d3Graph
        .selectAll<SVGGElement, ViewNode>(".node")
        .data(nodes, nodeKey);
      d3Nodes
        .enter()
        .call(enterArchimateViewNode.bind(null, entityClicked, selectedEntity));
      d3Nodes.exit().remove();
      d3Nodes.call(updateArchimateViewNode);

      const d3Links = d3Graph
        .selectAll<SVGLineElement, Connection>(".link")
        .data(links, (link) => link.id);
      d3Links.enter().insert("line", ".node").call(enterLink);
      d3Links.exit().remove();
      d3Links.call(updateLink);
    }
  }, [
    force,
    nodes,
    links,
    autoLayout,
    onForceLayoutTick,
    entityClicked,
    selectedEntity,
  ]);

  return <g ref={gRef} />;
};

export default Graph;
