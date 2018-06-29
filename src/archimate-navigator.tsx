import * as React from "react";
import {Col, Grid, Row, Tab, Tabs} from "react-bootstrap";
import ArchimateBlankSvg from "./archimate-blank-svg";
import * as DiagramFuncs from "./archimate-diagram";
import ArchimateDiagramTree from "./archimate-diagram-tree";
import ArchimateGraphTab from "./archimate-graph-tab";
import ArchimateHeader, {ActiveView} from "./archimate-header";
import ArchimateInfo from "./archimate-info";
import Model from "./archimate-model";
import "./archimate-navigator.css"
// import ArchimateModelStore from "./archimate-model-store";
import CypherQuery from "./cypher-query";
import Diagram from "./diagram";
import Entity from "./entity";
import GraphModelStore from "./graph-model-store";
import GraphVisualization, {ID3Graph} from "./graph-visualization";
import ArchimateSearch from "./search";
import Svg from "./svg";

enum SidebarTab {
    DiagramTreeTab = 1,
    InfoTab,
    SearchTab,
    GraphTab,
}

interface IProps {
    selectedDiagram?: Diagram;
    selectedEntity?: Entity;
}

interface IState {
    selectedDiagram?: Diagram;
    diagramSvg?: Svg;
    graphSvg?: Svg;
    selectedEntity?: Entity;
    graphQuery?: string;
    graphQueryResults: any[];
    sampleQueries: CypherQuery[];
    sidebarTabKey: SidebarTab;
    selectedView: ActiveView;
    model: Model;
}

const SAMPLE_QUERIES: CypherQuery[] = [
    {
        name: "Applications that use Core",
        query:
            `MATCH p = (a:ApplicationComponent) <-[r*1..5]- (core:ApplicationComponent {name: "Core"})
             WHERE all(x IN rels(p)
             WHERE x.weight >= 6) AND
                   size(filter(n in nodes(p) where n:ApplicationComponent)) < 3
             return a, r, core`,
    },
    {
        name: "Anything that uses Core or Core Interfaces",
        query:
            `MATCH p = (core:ApplicationComponent {name: "Core"})-[r:CompositionRelationship]->
                 (interface:ApplicationInterface)-[r2:UsedByRelationship]->()
                 RETURN p
             UNION
                 MATCH p=(core:ApplicationComponent {name: "Core"})-[r2:UsedByRelationship]->()
             return p;`,
    },
];

export default class ArchimateNavigator extends React.Component<IProps, IState> {

    public state: IState;

    private graphModelStore: GraphModelStore;
    // private store: ArchimateModelStore;
    private req?: XMLHttpRequest;
    // private diagramDiv : Element | null;
    private graphViz?: GraphVisualization;

    constructor(props: IProps) {
        super(props);
        this.state = {
            diagramSvg: undefined,
            graphQuery: undefined,
            graphQueryResults: [],
            graphSvg: undefined,
            model: new Model([], []),
            sampleQueries: SAMPLE_QUERIES,
            selectedDiagram: undefined,
            selectedEntity: undefined,
            selectedView: ActiveView.Diagram,
            sidebarTabKey: SidebarTab.DiagramTreeTab,
        };
        // this.diagramDiv = null;
        // this.store = new ArchimateModelStore(this.storeCallback);
        this.graphModelStore = new GraphModelStore();
        this.req = undefined;
        this.graphViz = undefined;

        // $(() => {
        // Initialize Bootstrap Tooltips
        // $('[data-toggle="tooltip"]').tooltip();
    }

    public render() {
        const diagramName = this.state.selectedDiagram ? this.state.selectedDiagram.name : "";
        const viewpoint = this.state.selectedDiagram ? this.state.selectedDiagram.viewpoint : "";
        const diagramClass = `archimate-svg-content ${this.state.selectedView === ActiveView.Diagram ? "" : "hidden"}`;
        const graphClass = `archimate-svg-content ${this.state.selectedView === ActiveView.Graph ? "" : "hidden"}`;
        const tableClass = `archimate-table-content ${this.state.selectedView === ActiveView.Table ? "" : "hidden"}`;
        return (
            <Grid bsClass="container-fluid">
                <Row className="show-grid">
                    <Col xs={12} md={3} className="archimate-view-nav">
                        <Tabs
                            animation={false}
                            defaultActiveKey={SidebarTab.DiagramTreeTab}
                            activeKey={this.state.sidebarTabKey}
                            onSelect={this.handleSelectSidebarTab}
                            id="archimate-sidebar-tabs"
                        >
                            <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
                                <ArchimateDiagramTree
                                    views={this.state.model.folders[0]}
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
                                    data={this.state.model.entities}
                                    resultClicked={this.linkClicked}
                                />
                            </Tab>
                            <Tab eventKey={SidebarTab.GraphTab} title="Graph">
                                <ArchimateGraphTab
                                    query={this.state.graphQuery}
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
                            viewpoint={viewpoint}
                            viewKey={this.state.selectedView}
                            viewSelected={this.viewSelected}
                            zoomIn={this.zoomIn}
                            zoomOut={this.zoomOut}
                            zoomFull={this.zoomFull}
                            selectedDiagram={this.state.selectedDiagram}
                            selectedSvg={this.selectedSvg()}
                        />
                        <div
                            id="archimate-current-diagram"
                            className={diagramClass}
                            // ref={(div) => { this.diagramDiv = div; }}
                            onClick={this.diagramClicked}
                        >
                            {this.jumboTron()}
                        </div>
                        <div id="archimate-current-graph" className={graphClass}>
                            <ArchimateBlankSvg svgRefCallback={this.svgRefCallback} />
                        </div>
                        <div id="archimate-table-view" className={tableClass}>
                            <p>Hi - I'm going to be the table view very soon now</p>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }

    // TODO: tell the graph viz to stop and shutdown (if it exists) prior to creating a new one.
    private svgRefCallback = (svg: SVGSVGElement): void => {
        this.setState({graphSvg: svg ? new Svg(svg, "#main-graph-group") : undefined});
        if (svg) {
            this.graphViz = new GraphVisualization(svg);
        }
    }

    private runQuery = (query: string) => {
        this.setState({graphQuery: query});
        this.graphModelStore.runQuery(query, this.graphDataCallback);
    }

    private graphDataCallback = (graph: ID3Graph) => {
        if (this.graphViz) {
            this.graphViz.showGraph(graph);
        }
    }

    // Called by the ArchimateModelStore once a model is loaded.
    // private storeCallback = (model: Model) => {
    //     this.setState({model});
    //     const hash = location.hash;
    //     if (hash.length > 1) {
    //         const id = hash.split("#")[1];
    //         let diagram: Diagram | null = null;
    //         try {
    //             diagram = model.diagram(id);
    //         } catch (err) {
    //             // TODO: report this error
    //             console.log(err.message);
    //         }
    //         this.linkClicked(diagram);
    //     }
    // }

    // Called when a sidebar tab is clicked.
    private handleSelectSidebarTab = (eventKey: any) => {
        this.setState({sidebarTabKey: eventKey});
        if ((eventKey === SidebarTab.GraphTab) && (this.state.selectedView === ActiveView.Diagram)) {
            this.setState({selectedView: ActiveView.Graph});
        }
    }

    // Displays the welcome message if there isn't a selected diagram and there are children in this element
    private jumboTron() {
        if ((!this.state.diagramSvg) && (this.props.children)) {
            return (
                <div className="jumbotron" id="archimate-splash-content">
                    {this.props.children}
                </div>
            );
        }
        return null;
    }

    // A diagram has been clicked. Need to find the id of the entity that has been clicked and
    // Trigger the correct state update
    private diagramClicked = (event: React.MouseEvent<Element>) => {
        const id = DiagramFuncs.findEventTarget(event.target);
        if (!id) {
            return;
        }
        const entity = this.state.model.entity(id);
        if (entity instanceof Diagram) {
            /* let diagram : Model.DiagramEntity = <Diagram>entity;*/
            this.setState({selectedDiagram: entity as Diagram});
        }
        this.setState({selectedEntity: entity});
    }

    private diagramLinkClicked = (diagram: Diagram) => {
        if (!diagram) {
            this.setState({selectedDiagram: undefined});
            return;
        }
        const normalizedDiagram = diagram.isNormalized() ? diagram : this.state.model.diagram(diagram.id);
        this.setState({
            selectedDiagram: normalizedDiagram,
            selectedEntity: normalizedDiagram,
            selectedView: ActiveView.Diagram,
        });
        if (diagram && (diagram.id) && (diagram.id.length > 0)) {
            location.hash = `#${diagram.id}`;
            this.loadDiagram(diagram.path);
        }
    }

    private linkClicked = (entity: Entity) => {
        if (!entity) {
            this.setState({selectedEntity: undefined});
            return;
        }
        const normalizedEntity = entity.isNormalized() ? entity : this.state.model.entity(entity.id);
        this.setState({
            selectedEntity: normalizedEntity,
            sidebarTabKey: SidebarTab.InfoTab,
        });
        if (entity instanceof Diagram) {
            this.diagramLinkClicked(normalizedEntity as Diagram);
        }
    }

    private loadDiagram(uri: string) {
        this.req = new XMLHttpRequest();
        this.req.addEventListener<"load">("load", this.diagramLoaded);
        this.req.addEventListener<"error">("error", this.diagramError);
        this.req.open("GET", uri, true);
        this.req.send();
    }

    private diagramLoaded = (evt: Event): void => {
        // const svgEl = this.req!.responseXML.querySelector("svg");
        // TODO: implement this
        // svgEl.setAttribute("data-id", this.state.selectedDiagram.id);
        // let svg = null;
        // if (svgEl) {
        //     while (this.diagramDiv.hasChildNodes()) {
        //         this.diagramDiv.removeChild(this.diagramDiv.lastChild);
        //     }
        //     const addedSvg = this.diagramDiv.appendChild(svgEl);
        //     svg = svgEl ? new Svg(svgEl) : null;
        // }
        // this.setState({diagramSvg: svg});
    }

    private diagramError = (evt: ErrorEvent) => {
        alert("Unable to load diagram");
    }

    private viewSelected = (view: ActiveView): void => {
        this.setState({selectedView: view});
        if (view !== ActiveView.Diagram) {
            this.setState({sidebarTabKey: SidebarTab.GraphTab});
        }
    }

    private selectedSvg = (): Svg | undefined => {
        switch(this.state.selectedView) {
        case ActiveView.Diagram:
            return this.state.diagramSvg;
        case ActiveView.Graph:
            return this.state.graphSvg;
        }
        return undefined;
    }

    private zoomIn = (): void => {
        const svg = this.selectedSvg();
        if (!svg) {
            return;
        }
        svg.zoomIn();
    }

    private zoomOut = (): void => {
        const svg = this.selectedSvg();
        if (!svg) {
            return;
        }
        svg.zoomOut();
    }

    private zoomFull = (): void => {
        const svg = this.selectedSvg();
        if (!svg) {
            return;
        }
        svg.zoomFull();
    }

    // private openInNewWindow = (): void => {};
}
