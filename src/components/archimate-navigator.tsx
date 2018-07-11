import * as React from "react";
import {Col, Grid, Row, Tab, Tabs} from "react-bootstrap";
import CypherQuery from "../graph/cypher-query";
import GraphModelStore from "../graph/graph-model-store";
import GraphVisualization, {ID3Graph} from "../graph/graph-visualization";
import * as DiagramFuncs from "../old-model/archimate-diagram";
import Model from "../old-model/archimate-model";
import Entity, { IEntity } from "../old-model/entity";
import OldDiagram from "../old-model/old-diagram";
import ArchimateBlankSvg from "./archimate-blank-svg";
import ArchimateHeader, {ActiveView} from "./archimate-header";
import "./archimate-navigator.css"
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
    GraphTab,
}

interface IProps {
    graphQuery?: string;
    modelUrl: string;
    selectedDiagram?: OldDiagram;
    selectedEntity?: Entity;
    selectedView?: ActiveView;
    sidebarTabKey?: SidebarTab;
}

interface IState {
    // diagramDiv? : Element | null;
    diagramSvg?: Svg;
    error?: string;
    graphModelStore?: GraphModelStore;
    graphQuery?: string;
    graphQueryResults: any[];
    graphSvg?: Svg;
    graphViz?: GraphVisualization;
    isLoaded: boolean;
    model: Model;
    req?: XMLHttpRequest;
    sampleQueries: CypherQuery[];
    selectedDiagram?: OldDiagram;
    selectedEntity?: Entity;
    selectedView: ActiveView;
    sidebarTabKey: SidebarTab;
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

    constructor(props: IProps) {
        super(props);
        this.state = {
            diagramSvg: undefined,
            graphModelStore: new GraphModelStore(),
            graphQuery: props.graphQuery,
            graphQueryResults: [],
            graphSvg: undefined,
            graphViz: undefined,
            isLoaded: false,
            model: new Model([], []),
            req: undefined,
            sampleQueries: SAMPLE_QUERIES,
            selectedDiagram: props.selectedDiagram,
            selectedEntity: props.selectedEntity,
            selectedView: props.selectedView || ActiveView.Diagram,
            sidebarTabKey: props.sidebarTabKey || SidebarTab.DiagramTreeTab,
        };
    }

    public componentDidMount() {
        fetch(this.props.modelUrl)
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({
                    isLoaded: true,
                    model: new Model(result.entities, result.folders),
                  });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  this.setState({
                    error,
                    isLoaded: true,
                  });
                }
            )
    }

    public render() {
        const diagramName = this.props.selectedDiagram ? this.props.selectedDiagram.name : "";
        const viewpoint = this.props.selectedDiagram ? this.props.selectedDiagram.viewpoint : "";
        return (
            <Grid bsClass="container-fluid">
                <Row>
                    <Col xs={12} md={12}>${this.state.error}</Col>
                </Row>
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
                            viewpoint={viewpoint}
                            viewKey={this.state.selectedView || ActiveView.Diagram}
                            viewSelected={this.viewSelected}
                            zoomIn={this.zoomIn}
                            zoomOut={this.zoomOut}
                            zoomFull={this.zoomFull}
                            selectedDiagram={this.state.selectedDiagram}
                            selectedSvg={this.selectedSvg()}
                        />
                        {this.mainView()}
                    </Col>
                </Row>
            </Grid>
        );
    }

    private mainView() {
        switch(this.state.selectedView) {
            case ActiveView.Diagram:
            default:
                return (
                    <ArchimateDiagramView
                        selectedDiagram={this.state.selectedDiagram}
                        entityClicked={this.linkClicked}
                        diagramClicked={this.diagramClicked} />
                );
            case ActiveView.Graph:
                return (<div id="archimate-current-graph">
                            <ArchimateBlankSvg svgRefCallback={this.svgRefCallback} />
                        </div>);
            case ActiveView.Table:
                return (<div id="archimate-table-view">
                            <p>Hi - I'm going to be the table view very soon now</p>
                        </div>);
        }
    }

    // TODO: tell the graph viz to stop and shutdown (if it exists) prior to creating a new one.
    private svgRefCallback = (svg: SVGSVGElement | undefined): void => {
        this.setState({graphSvg: svg ? new Svg(svg, "#main-graph-group") : undefined});
        if (svg) {
            this.state.graphViz = new GraphVisualization(svg);
        }
    }

    private runQuery = (query: string) => {
        this.setState({graphQuery: query});
        this.state.graphModelStore!.runQuery(query, this.graphDataCallback);
    }

    private graphDataCallback = (graph: ID3Graph) => {
        if (this.state.graphViz) {
            this.state.graphViz.showGraph(graph);
        }
    }

    // Called when a sidebar tab is clicked.
    private handleSelectSidebarTab = (eventKey: any) => {
        this.setState({sidebarTabKey: eventKey});
        if ((eventKey === SidebarTab.GraphTab) && (this.state.selectedView === ActiveView.Diagram)) {
            this.setState({selectedView: ActiveView.Graph});
        }
    }

    // A diagram has been clicked. Need to find the id of the entity that has been clicked and
    // Trigger the correct state update
    private diagramClicked = (event: React.MouseEvent<Element>) => {
        const id = DiagramFuncs.findEventTarget(event.target);
        if (!id) {
            return;
        }
        const entity = this.state.model.entity(id);
        if (entity instanceof OldDiagram) {
            /* let diagram : Model.DiagramEntity = <Diagram>entity;*/
            this.setState({selectedDiagram: entity as OldDiagram});
        }
        this.setState({selectedEntity: entity});
    }

    private diagramLinkClicked = (entity: IEntity) => {
        if (!entity) {
            this.setState({selectedDiagram: undefined});
            return;
        }
        const diagram = entity as OldDiagram;
        const normalizedDiagram = diagram.isNormalized() ? diagram : this.state.model.diagram(diagram.id);
        this.setState({
            selectedDiagram: normalizedDiagram,
            selectedEntity: normalizedDiagram,
            selectedView: ActiveView.Diagram,
        });
        if (diagram && (diagram.id) && (diagram.id.length > 0)) {
            location.hash = `#${diagram.id}`;
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
        if (entity instanceof OldDiagram) {
            this.diagramLinkClicked(normalizedEntity as OldDiagram);
        }
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
