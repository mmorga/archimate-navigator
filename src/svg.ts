import * as d3selection from "d3-selection";
import * as d3zoom from "d3-zoom";

export default class Svg {
    private readonly svgEl: SVGSVGElement;
    private readonly svg: d3selection.Selection<SVGSVGElement, {}, null, undefined>;
    private readonly transformSelector?: string;
    private readonly zoom: d3zoom.ZoomBehavior<Element, {}>;
    private resizeTimeout?: NodeJS.Timer;

    constructor(svg: SVGSVGElement, transformSelector?: string) {
        this.svgEl = svg;
        this.svg = d3selection.select(svg);
        this.transformSelector = transformSelector;
        this.resizeTimeout = undefined;
        this.zoom = d3zoom.zoom().on("zoom", this.handleZoom);
        this.initDisplay();
    }

    public zoomIn = () => {
        this.transformSelection().call(this.zoom.scaleBy, 2);
    }

    public zoomOut = () => {
        this.transformSelection().call(this.zoom.scaleBy, 0.5);
    }

    public zoomFull = () => {
        this.resetViewBox();
        this.transformSelection().call(this.zoom.transform, d3zoom.zoomIdentity);
    }

    public download = () => {
        alert("TODO");
    }

    public transformSelection = (): d3selection.Selection<d3selection.BaseType, {}, null, undefined> => {
        if (!this.transformSelector) {
            return this.svg;
        }
        const sel = this.svg.select(this.transformSelector);
        return sel || this.svg;
    }

    public initDisplay() {
        this.resetViewBox();
        this.svg
            .attr("style", "")
            .call(this.zoom);
        this.resizeHandler();
        this.transformSelection().attr("transform", "translate(0,0)");
        this.initResizeHandler();
    }

    private handleZoom = () => {
        this.transformSelection().attr("transform", d3selection.event.transform);
    }

    private resizeHandler = () => {
        const parent = this.svgEl.parentElement;
        if (!parent) {
            return;
        }
        const clientRect = parent.getClientRects()[0];
        if (!clientRect) {
            return;
        }
        this.svg
            .attr("width", clientRect.width)
            .attr("height", clientRect.height);
    }

    /**
     * Sets up a throttled resize event handler for the winow.
     *
     * @param {() => void} actualResizeHandler throttled callback to handle window resize.
     * @return {void}
     */
    private initResizeHandler(): void {
        window.addEventListener("resize", this.resizeThrottler, false);
    }

    private resizeThrottler = () => {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if ( !this.resizeTimeout ) {
            this.resizeTimeout = setTimeout(() => {
                this.resizeTimeout = undefined;
                this.resizeHandler();
                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }

    /**
     * Resizes an SVG's viewBox based on the bounding box of the SVG element
     *
     */
    private resetViewBox() {
        // const bb = this.svgEl.getBBox();
        // const viewBox = `${Math.floor(bb.x)} ${Math.floor(bb.y) - 1} ${Math.floor(bb.width) + 2} ${Math.floor(bb.height) + 2}`;
        // this.svg.attr("viewBox", viewBox);
    }
}
