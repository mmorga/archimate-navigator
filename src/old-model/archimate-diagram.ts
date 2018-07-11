// interface SvgRect {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// }

// const svgNS: string = "http://www.w3.org/2000/svg";

function svgDiagram(): SVGSVGElement {
    return document.querySelector("#archimate-current-diagram > svg") as SVGSVGElement;
};

// const setSvgRect = function setSvgRect(svgRect: SvgRect, x: number, y: number,
//                                        width: number, height:number): SvgRect {
//     svgRect.x = x;
//     svgRect.y = y;
//     svgRect.width = width;
//     svgRect.height = height;
//     return svgRect;
// };

// const resetDiagramViewBox = function resetDiagramViewBox() : SVGSVGElement {
//     const svg: SVGSVGElement = svgDiagram();
//     const vbVals: number[] = svg.getAttribute("data-view-box").split(" ").map(s => parseFloat(s));
//     svg.viewBox.baseVal.x = vbVals[0];
//     svg.viewBox.baseVal.y = vbVals[1];
//     svg.viewBox.baseVal.width = vbVals[2];
//     svg.viewBox.baseVal.height = vbVals[3];
//     return svg;
// };

// const oneToOne = function oneToOne() : boolean {
//     const svg = svgDiagram();
//     if (svg === null) {
//         return false;
//     }

//     const svgViewBox = svg.viewBox.baseVal;
//     const article: Element = document.querySelector(".archimate-diagram-view");
//     if (article === null) {
//         return false;
//     }

//     const articleClientRect = article.getBoundingClientRect();
//     if ((articleClientRect.width >= svgViewBox.width) &&
//         (articleClientRect.height >= svgViewBox.height)) {
//         resetDiagramViewBox();
//     }

//     return false;
// };

// const createSvgTag = function createSvgTag(tag: string): Element {
//     return document.createElementNS(svgNS, tag);
// };

// const highlightSelectedElement = function highlightSelectedElement(id: string): boolean {
//     const svg = svgDiagram();
//     if (svg === null) {
//         return false;
//     }

//     let highlightElement = svg.getElementById("archimate-selected-element") as SVGRectElement;
//     if (highlightElement === null) {
//         // const defs = $("defs", svg); /* TODO: if defs isn"t found, create one */
//         const defs = document.querySelector("svg > defs");
//         const grad = createSvgTag("linearGradient") as SVGLinearGradientElement;
//         grad.gradientUnits.baseVal = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;
//         grad.spreadMethod.baseVal = SVGGradientElement.SVG_SPREADMETHOD_REFLECT;
//         grad.setAttribute("y2", "1");
//         grad.setAttribute("y1", "0");
//         grad.setAttribute("x2", "1");
//         grad.setAttribute("x1", "0");
//         grad.setAttribute("id", "archimate-highlight-color");
//         defs!.appendChild(grad);
//         const stops = [
//             ["#000000", "0%"],
//             ["#ffffff", "100%"],
//         ];
//         stops.forEach((stop) => {
//             const stopNode = createSvgTag("stop");
//             stopNode.setAttribute("stop-color", stop[0]);
//             stopNode.setAttribute("offset", stop[1]);
//             grad.appendChild(stopNode);
//         });

//         const rect = createSvgTag("rect") as SVGRectElement;
//         rect.setAttribute("id", "archimate-selected-element");
//         rect.setAttribute("class", "archimate-selected-element-highlight");
//         highlightElement = svg.appendChild(rect) as SVGRectElement;
//     }
//     const selectedElement = svg.getElementById(id) as SVGGraphicsElement;
//     if (selectedElement === null) {
//         highlightElement.setAttribute("style", "display: none");
//         return false;
//     }
//     const bbox = selectedElement.getBBox();
//     // const ctm = selectedElement.getCTM();

//     // const viewBox = svg.viewBox.baseVal;
//     highlightElement.setAttribute("style", "display: inherit");
//     highlightElement.setAttribute("x", bbox.x.toString());
//     highlightElement.setAttribute("y", bbox.y.toString());
//     highlightElement.setAttribute("width", bbox.width.toString());
//     highlightElement.setAttribute("height", bbox.height.toString());
//     highlightElement = selectedElement.appendChild(highlightElement);
//     // .setAttribute("transform", `matrix(${ctm.a},${ctm.b},${ctm.c},${ctm.d},${ctm.e},${ctm.f})`);
//     return false;
// };

// const remove = function remove(qry: string): void {
//     const els = document.querySelectorAll(qry);
//     for (const el of els) {
//         el.remove();
//     }
// };

// const removeAllChildren = function removeAllChildren(parent: INode): void {
//     if (parent === null) {
//         return;
//     }
//     while (parent.firstChild) {
//         parent.removeChild(parent.firstChild);
//     }
// };

export function findEventTarget(target: EventTarget | Element): string | null {
    if (!(target instanceof Element)) {
        return null;
    }
    const t = target as Element;
    if ((t.tagName === "svg") && (Object.prototype.hasOwnProperty.call(t, "data-id"))) {
        return t.getAttribute("data-id");
    }
    if ((t.id.length === 0) && (t.parentElement)) {
        return findEventTarget(t.parentElement);
    }
    if (t.id === "archimate-current-diagram") {
        return svgDiagram()!.getAttribute("data-id");
    }
    return t.id;
}

// const diagramClicked = function diagramClicked(evt: MouseEvent): boolean {
//     const id = findEventTarget(evt.target);
//     if (id !== null) {
//         highlightSelectedElement(id);
//         if (((evt.target as Element).tagName) !== "svg") {
//             // TODO: Set location hash to the clicked element id
//         }
//     }
//     return true;
// };
