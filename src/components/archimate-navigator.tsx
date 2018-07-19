import * as React from "react";
import { Col, Grid, Row, Tab, Tabs } from "react-bootstrap";
import { Diagram, IEntity, Model, parse } from "../archimate-model";
import CypherQuery from "../graph/cypher-query";
import GraphModelStore from "../graph/graph-model-store";
import GraphVisualization, { ID3Graph } from "../graph/graph-visualization";
import ArchimateBlankSvg from "./archimate-blank-svg";
import ArchimateHeader, { ActiveView } from "./archimate-header";
import "./archimate-navigator.css";
import ArchimateDiagramView from "./main/archimate-diagram-view";
import ArchimateDiagramTree from "./sidebar/archimate-diagram-tree";
import ArchimateGraphTab from "./sidebar/archimate-graph-tab";
import ArchimateInfo from "./sidebar/archimate-info";
import ArchimateSearch from "./sidebar/search";
import Svg from "./svg";

enum SidebarTab {
  DiagramTreeTab = 1,
  InfoTab,
  SearchTab,
  GraphTab
}

interface IProps {
  graphQuery?: string;
  modelUrl: string;
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  selectedView?: ActiveView;
  sidebarTabKey?: SidebarTab;
}

interface IState {
  diagramDivHeight: number;
  diagramSvg?: Svg;
  diagramZoom: number;
  error?: any;
  graphModelStore?: GraphModelStore;
  graphQuery?: string;
  graphQueryResults: any[];
  graphSvg?: Svg;
  graphViz?: GraphVisualization;
  isLoaded: boolean;
  model: Model;
  req?: XMLHttpRequest;
  sampleQueries: CypherQuery[];
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  selectedView: ActiveView;
  sidebarTabKey: SidebarTab;
  xmlDocStr?: string;
  xmlDoc?: Document;
}

const SAMPLE_QUERIES: CypherQuery[] = [
  {
    name: "Applications that use Core",
    query: `MATCH p = (a:ApplicationComponent) <-[r*1..5]- (core:ApplicationComponent {name: "Core"})
             WHERE all(x IN rels(p)
             WHERE x.weight >= 6) AND
                   size(filter(n in nodes(p) where n:ApplicationComponent)) < 3
             return a, r, core`
  },
  {
    name: "Anything that uses Core or Core Interfaces",
    query: `MATCH p = (core:ApplicationComponent {name: "Core"})-[r:CompositionRelationship]->
                 (interface:ApplicationInterface)-[r2:UsedByRelationship]->()
                 RETURN p
             UNION
                 MATCH p=(core:ApplicationComponent {name: "Core"})-[r2:UsedByRelationship]->()
             return p;`
  }
];

export default class ArchimateNavigator extends React.Component<
  IProps,
  IState
> {
  public state: IState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      diagramDivHeight: this.calcDiagramDivHeight(),
      diagramSvg: undefined,
      diagramZoom: 100,
      graphModelStore: new GraphModelStore(),
      graphQuery: props.graphQuery,
      graphQueryResults: [],
      graphSvg: undefined,
      graphViz: undefined,
      isLoaded: false,
      model: new Model(),
      req: undefined,
      sampleQueries: SAMPLE_QUERIES,
      selectedDiagram: props.selectedDiagram,
      selectedEntity: props.selectedEntity,
      selectedView: props.selectedView || ActiveView.Diagram,
      sidebarTabKey: props.sidebarTabKey || SidebarTab.DiagramTreeTab
    };
  }

  public componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));
    const parser = new DOMParser();
    fetch(this.props.modelUrl)
      .then((response: Response) => response.text())
      .then((str: string) => {
          const xmlDocument = parser.parseFromString(str, "application/xml");
          let parsedModel;
          try {
            parsedModel = parse(xmlDocument.children[0].ownerDocument);
          } catch (err) {
            this.setState({error: err});
          }
          this.setState({
            isLoaded: true,
            model: parsedModel || this.state.model,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            error,
            isLoaded: true
          });
        }
      );
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.onResize.bind(this));
  }

  public render() {
    const diagramName = this.props.selectedDiagram
      ? this.props.selectedDiagram.name
      : "";
    const viewpoint = this.props.selectedDiagram
      ? this.props.selectedDiagram.viewpoint
      : "";
    return (
      <Grid bsClass="container-fluid">
        {this.exceptionView()}
        <Row className="show-grid">
          <Col xs={12} md={3} className="archimate-view-nav">
            <Tabs
              animation={false}
              defaultActiveKey={SidebarTab.DiagramTreeTab}
              activeKey={this.props.sidebarTabKey}
              onSelect={this.handleSelectSidebarTab}
              id="archimate-sidebar-tabs"
            >
              <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
                <ArchimateDiagramTree
                  views={
                    this.state.model.organizations[
                      this.state.model.organizations.length - 1
                    ]
                  }
                  entityClicked={this.diagramLinkClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.InfoTab} title="Info">
                <ArchimateInfo
                  entity={this.state.selectedEntity}
                  entityClicked={this.linkClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.SearchTab} title="Search">
                <ArchimateSearch
                  data={this.state.model.entities()}
                  resultClicked={this.linkClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.GraphTab} title="Graph">
                <ArchimateGraphTab
                  query={this.props.graphQuery}
                  results={this.state.graphQueryResults}
                  runQuery={this.runQuery}
                  sampleQueries={this.state.sampleQueries}
                />
              </Tab>
            </Tabs>
          </Col>
          <Col xs={12} md={9} className="archimate-diagram-view">
            <ArchimateHeader
              name={diagramName}
              viewpoint={viewpoint || "Total"}
              viewKey={this.state.selectedView || ActiveView.Diagram}
              viewSelected={this.viewSelected}
              zoomIn={this.zoomIn}
              zoomOut={this.zoomOut}
              zoomFull={this.zoomFull}
              selectedDiagram={this.state.selectedDiagram}
              selectedSvg={this.selectedSvg()}
              diagramZoom={this.state.diagramZoom}
            />
            <div className="archimate-svg-container" style={{height: this.state.diagramDivHeight}}>
              {this.mainView()}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  private errorMessage() {
    if (this.state.error === undefined) {
      return undefined;
    }
    if (this.state.error instanceof String) {
      return this.state.error;
    }
    const err = this.state.error as Error;
    return `${err.name}: ${err.message}`
  }

  private exceptionView() {
    return (
    <Row>
      <Col xs={12} md={12}>
        <p>{this.errorMessage()}</p>
      </Col>
    </Row>
    );
  }
  private mainView() {
    switch (this.state.selectedView) {
      case ActiveView.Diagram:
      default:
        return (
          <ArchimateDiagramView
            key={this.state.selectedDiagram ? this.state.selectedDiagram.id : "archimate-no-diagram"}
            selectedDiagram={this.state.selectedDiagram}
            entityClicked={this.linkClicked}
            diagramClicked={this.diagramClicked}
            diagramZoom={this.state.diagramZoom}
          />
        );
      case ActiveView.Graph:
        return (
          <div id="archimate-current-graph">
            <ArchimateBlankSvg svgRefCallback={this.svgRefCallback} />
          </div>
        );
      case ActiveView.Table:
        return (
          <div id="archimate-table-view">
            <p>Hi - I'm going to be the table view very soon now</p>
          </div>
        );
    }
  }

  // TODO: tell the graph viz to stop and shutdown (if it exists) prior to creating a new one.
  private svgRefCallback = (svg: SVGSVGElement | undefined): void => {
    this.setState({
      graphSvg: svg ? new Svg(svg, "#main-graph-group") : undefined
    });
    if (svg) {
      this.state.graphViz = new GraphVisualization(svg);
    }
  };

  private runQuery = (query: string) => {
    this.setState({ graphQuery: query });
    this.state.graphModelStore!.runQuery(query, this.graphDataCallback);
  };

  private graphDataCallback = (graph: ID3Graph) => {
    if (this.state.graphViz) {
      this.state.graphViz.showGraph(graph);
    }
  };

  // Called when a sidebar tab is clicked.
  private handleSelectSidebarTab = (eventKey: any) => {
    this.setState({ sidebarTabKey: eventKey });
    if (
      eventKey === SidebarTab.GraphTab &&
      this.state.selectedView === ActiveView.Diagram
    ) {
      this.setState({ selectedView: ActiveView.Graph });
    }
  };

  // A diagram has been clicked. Need to find the id of the entity that has been clicked and
  // Trigger the correct state update
  private diagramClicked = (event: React.MouseEvent<Element>) => {
    const id = findEventTarget(event.target);
    if (!id) {
      return;
    }
    const entity = this.state.model.lookup(id);
    if (entity instanceof Diagram) {
      /* let diagram : Model.DiagramEntity = <Diagram>entity;*/
      this.setState({ selectedDiagram: entity as Diagram });
    }
    this.setState({ selectedEntity: entity });
  };

  private diagramLinkClicked = (entity: IEntity) => {
    if (!entity) {
      this.setState({ selectedDiagram: undefined });
      return;
    }
    const diagram = entity as Diagram;
    const normalizedDiagram = diagram; // diagram.isNormalized() ? diagram : this.state.model.diagram(diagram.id);
    this.setState({
      selectedDiagram: normalizedDiagram,
      selectedEntity: normalizedDiagram,
      selectedView: ActiveView.Diagram
    });
    if (diagram && diagram.id && diagram.id.length > 0) {
      location.hash = `#${diagram.id}`;
    }
  };

  private linkClicked = (entity: IEntity) => {
    if (!entity) {
      this.setState({ selectedEntity: undefined });
      return;
    }
    const normalizedEntity = entity; // entity.isNormalized() ? entity : this.state.model.lookup(entity.id);
    this.setState({
      selectedEntity: normalizedEntity,
      sidebarTabKey: SidebarTab.InfoTab
    });
    if (entity instanceof Diagram) {
      this.diagramLinkClicked(normalizedEntity as Diagram);
    }
  };

  private viewSelected = (view: ActiveView): void => {
    this.setState({ selectedView: view });
    if (view !== ActiveView.Diagram) {
      this.setState({ sidebarTabKey: SidebarTab.GraphTab });
    }
  };

  private selectedSvg = (): Svg | undefined => {
    switch (this.state.selectedView) {
      case ActiveView.Diagram:
        return this.state.diagramSvg;
      case ActiveView.Graph:
        return this.state.graphSvg;
    }
    return undefined;
  };

  private zoomIn = (): void => {
    this.setState({diagramZoom: this.state.diagramZoom + (this.state.diagramZoom / 10)});
  };

  private zoomOut = (): void => {
    this.setState({diagramZoom: this.state.diagramZoom - (this.state.diagramZoom / 10)});
  };

  private zoomFull = (): void => {
    this.setState({diagramZoom: 100});
  };

  // private openInNewWindow = (): void => {};

  private onResize() {
    this.setState({
      diagramDivHeight: this.calcDiagramDivHeight(),
    });
  }

  private calcDiagramDivHeight(): number {
    return window.innerHeight - 70;
  }
}

// interface SvgRect {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// }

// const svgNS: string = "http://www.w3.org/2000/svg";

function svgDiagram(): SVGSVGElement {
  return document.querySelector(
    "#archimate-current-diagram > svg"
  ) as SVGSVGElement;
}

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
  if (
    t.tagName === "svg" &&
    Object.prototype.hasOwnProperty.call(t, "data-id")
  ) {
    return t.getAttribute("data-id");
  }
  if (t.id.length === 0 && t.parentElement) {
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
