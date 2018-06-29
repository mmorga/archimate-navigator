// import * as d3selection from "d3-selection";
import {ILink, INode, SelectionType} from "./graph-visualization";

interface ILine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface IPoint {
    x: number;
    y: number;
}

/**
 * Updates the graph's links on each tick of the D# Force simulation.
 *
 * ILink additions, moves, and deletions are handled in this function
 *
 * @param {SelectionType} svg D3 selection of the graph
 * @param {ILink[]} links List of links for this update
 * @return void
 */
export default class GraphLinks {
    private svg: SelectionType;
    private nodeHeight: number;
    private nodeWidth: number;

    constructor(svg: SelectionType, nodeHeight: number, nodeWidth: number) {
        this.svg = svg;
        this.nodeHeight = nodeHeight;
        this.nodeWidth = nodeWidth;
    }

    public transformSelection(sel: SelectionType): void {
        this.svg = sel;
    }

    public updateLinks(links: ILink[]): void {
        // Update…
        const line = this.svg.selectAll("line")
            .data(links)
            .attr("x1", (d: ILink) => this.adjustLine(this.linkToLine(d)).x1)
            .attr("y1", (d: ILink) => this.adjustLine(this.linkToLine(d)).y1)
            .attr("x2", (d: ILink) => this.adjustLine(this.linkToLine(d)).x2)
            .attr("y2", (d: ILink) => this.adjustLine(this.linkToLine(d)).y2);

        // Enter…
        line.enter().append("line")
            .attr("id", (d: ILink) => d.id)
            .attr("x1", (d: ILink) => this.adjustLine(this.linkToLine(d)).x1)
            .attr("y1", (d: ILink) => this.adjustLine(this.linkToLine(d)).y1)
            .attr("x2", (d: ILink) => this.adjustLine(this.linkToLine(d)).x2)
            .attr("y2", (d: ILink) => this.adjustLine(this.linkToLine(d)).y2)
            .attr("class", (d: ILink) => `archimate-${d.linkType}`)
            .style("stroke", "black")
            .style("stroke-width", 1);

        // Exit…
        line.exit().remove();
    }

    /**
     * Returns true if there is an overlap (common sub-range) between r1 and r2
     */
    private rangesOverlap(r1: number[], r2: number[]): number | undefined {
        const beginMax = r1[0] < r2[0] ? r2[0] : r1[0];
        const endMin = r1[1] > r2[1] ? r2[1] : r1[1];
        if (beginMax > endMin) {
            return undefined;
        }
        return (beginMax + endMin) / 2.0;
    }

    /**
     * Returns true if point a is to the right of point b in the SVG coordinate system
     */
    private isRightOf(a: IPoint, b: IPoint): boolean {
        return a.x > b.x;
    }

    /**
     * Returns true if point a is above point b in the SVG coordinate system
     */
    private isAbove(a: IPoint, b: IPoint): boolean {
        return a.y < b.y;
    }

    /**
     * Takes a ILink and turns it into an object with the attributes for an SVG line
     */
    private linkToLine(d: ILink): ILine {
        return {
            x1: (d.source as INode).x || 0,
            x2: (d.target as INode).x || 0,
            y1: (d.source as INode).y || 0,
            y2: (d.target as INode).y || 0,
        };
    }

   /**
    * Takes a line object and adjusts the starting and ending points to be on the edge of
    * the standard node size expressed by nodeWidth & nodeHeight.
    */
    private adjustLine(line: ILine): ILine {
        const h2 = this.nodeHeight / 2;
        const w2 = this.nodeWidth / 2;
        const a = {x: line.x1, y: line.y1};
        const b = {x: line.x2, y: line.y2};

        const axRange = [a.x - w2, a.x + w2];
        const bxRange = [b.x - w2, b.x + w2];

        const overlapXCenter = this.rangesOverlap(axRange, bxRange);

        let ax = null;
        let bx = null;

        if (overlapXCenter) {
            ax = bx = overlapXCenter;
        } else if (this.isRightOf(b, a)) {
            ax = a.x + w2;
            bx = b.x - w2;
        } else {
            ax = a.x - w2;
            bx = b.x + w2;
        }

        const ayRange = [a.y - h2, a.y + h2];
        const byRange = [b.y - h2, b.y + h2];

        const overlapYCenter = this.rangesOverlap(ayRange, byRange);

        let ay = null;
        let by = null;
        if (overlapYCenter) {
            ay = by = overlapYCenter;
        } else if (this.isAbove(b, a)) {
            ay = a.y - h2;
            by = b.y + h2;
        } else {
            ay = a.y + h2;
            by = b.y - h2;
        }

        return {
            x1: ax,
            x2: bx,
            y1: ay,
            y2: by,
        };
    }
}
