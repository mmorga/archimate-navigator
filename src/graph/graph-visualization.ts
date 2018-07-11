import * as d3force from "d3-force";
import * as d3selection from "d3-selection";
// import * as d3zoom from "d3-zoom";
// import SvgText from "svg-text";
import GraphLinks from "./graph-links";
import GraphNodes from "./graph-nodes";

/**
 * Helper to simplify function typing
 */
export type SelectionType = d3selection.Selection<SVGGElement, INode, d3selection.BaseType, undefined>;
export type ParentGroupType = d3selection.Selection<SVGGElement, undefined, d3selection.BaseType, undefined>;

/**
 * INode data type for ArchiMate elements
 */
export interface INode extends d3force.SimulationNodeDatum {
    id: string;
    name: string;
    layer: string;
    nodeType: string;
    labels: string[];
    nodeId: string;
}

export function inodeKeyFunc(this: SVGGElement, datum: INode, index: number, groups: SVGGElement[]) { 
    return datum.id;
}

/**
 * Data type for ArchiMate relationships
 */
export interface ILink extends d3force.SimulationLinkDatum<INode> {
    id: string;
    linkType: string;
    relationshipId: string;
    weight: number;
}

/**
 * Internal data structure for the ArchiMate model subset shown in the graph
 */
export interface ID3Graph {
    nodes: INode[];
    links: ILink[];
}

export default class GraphVisualization {
    /**
     * Attributes governing the size of nodes in the graph SVG
     */
    private svgEl: SVGSVGElement;
    private svg: d3selection.Selection<SVGSVGElement, undefined, d3selection.BaseType, undefined>;
    private graph?: ID3Graph;
    private graphNodes: GraphNodes;
    private graphLinks: GraphLinks;

    private nodeWidth = 120;
    private nodeHeight = 55;

    constructor(svgEl: SVGSVGElement) {
        this.svgEl = svgEl;
        this.svg = d3selection.select(svgEl);
        this.graphNodes = new GraphNodes(this.transformSelection(), this.nodeWidth, this.nodeHeight);
        this.graphLinks = new GraphLinks(this.transformSelection(), this.nodeWidth, this.nodeHeight);
    }

    public transformSelection(): ParentGroupType {
        const sel = this.svg.select<SVGGElement>("#main-graph-group");
        if (sel.empty()) {
           return this.svg
                .append<SVGGElement>("g")
                .attr("id", "main-graph-group")
                .attr("transform", "translate(0,0)"); // TODO: this should be handled by the SVG class attached.
        }
        return sel;
    }

    /**
     * Show the graph for the given data
     *
     * @param {ID3Graph} contents of the graph to display
     */
    public showGraph(graph: ID3Graph, clearFirst = true): boolean {
        if (clearFirst) {
            this.svg.select("#main-graph-group").remove();
            this.graph = graph;
            const sel = this.transformSelection();
            this.graphNodes.transformSelection(sel);
            this.graphLinks.transformSelection(sel);
        } // TODO: otherwise merge graph with this.graph

        const clientRect = this.svgEl.getClientRects()[0];
        d3force.forceSimulation(graph.nodes)
            .force("center", d3force.forceCenter(clientRect.width / 2, clientRect.height / 2))
            .force("collide", d3force.forceCollide(this.nodeWidth))
            .force("link", d3force.forceLink<INode, ILink>(graph.links)
                   .id((node: INode, i: number, nodesData: INode[]) => node.id)
                   // TODO: experiment with this
                   .distance(this.adjustLinkDistance),
                   // .strength(adjustLinkStrength)
                  )
            .force("charge", d3force.forceManyBody())
            .on("tick", this.ticked);
        // .on("end", resetViewBoxUnlessZoomed); // TODO: hook this up to the Svg

        this.graphNodes.updateNodes(graph.nodes);
        this.graphLinks.updateLinks(graph.links);
        this.flowMyTextThePolicemanSaid(this.svgEl);

        // TODO: on resize, the center point of the simulation force need to be set.
        // initResizeHandler(() => {
        //     const resizeClientRect = curDiagramParent.getClientRects()[0];
        //     simulation.force("center", d3force.forceCenter(resizeClientRect.width / 2, resizeClientRect.height / 2));
        // });

        // TODO: while the simulation is running, periodically reset the view box if
        //       the user hasn't already started to zoom in.
        // function resetViewBoxUnlessZoomed() {
        //     if (graphG.attr("transform") === "translate(0,0)") {
        //         resetViewBox(svgEl);
        //     }
        // }
        return true;
    }

    /**
     * Called on each "tick" of the D3 Force simulation
     * Not to be called directly
     */
    private ticked = () => {
        this.graphNodes.updateNodes(this.graph!.nodes);
        this.graphLinks.updateLinks(this.graph!.links);
        // resetViewBoxUnlessZoomed();  // TODO: hook this up with Svg class instance
    }

    /**
     * This is used to reformat the text for a node to the shape of a node
     */
    private flowMyTextThePolicemanSaid = (svg: SVGSVGElement): void => {
        const nodes = svg.querySelectorAll("g.node");
        // for (let idx = 0; idx < nodes.length; idx++) {
        //     const nodeG = nodes[idx];
        for (const nodeG of Array.from(nodes)) {
            const nodeT = nodeG.querySelector("text.unflowed-text");
            if (nodeT) {
                // const text = nodeT.innerHTML;
                nodeT.remove();
                // new SvgText({
                //     x: this.nodeWidth / 2,
                //     y: this.nodeHeight / 2,
                //     text,
                //     element: nodeG,
                //     svg,
                //     outerWidth: this.nodeWidth,
                //     outerHeight: this.nodeHeight,
                //     align: "center",
                //     verticalAlign: "middle",
                //     textOverflow: "ellipsis",
                // });
            }
        }
    }

    private adjustLinkDistance = (d: ILink): number => {
        switch (d.linkType) {
        case "CompositionRelationship":
        case "AssignmentRelationship":
            return 15;
        default:
            return 60;
        }
    }

    // TODO: This would need to make the strength dependent on the number of source targets by
    // type that has a dependent link distance (as shown above) rather than the total number of
    // nodes which is what the current implementation does.
    // private adjustLinkStrength(link: ILink): number {
    //     switch (link.linkType) {
    //     case "CompositionRelationship":
    //     case "AssignmentRelationship":
    //     case "RealisationRelationship":
    //         return 1;
    //     default:
    //         return 1 / 8;
    //         // const def = 1 / Math.min(count(link.source), count(link.target));
    //     }
    // };
}
