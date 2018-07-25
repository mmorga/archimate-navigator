import * as React from "react";
import { Col, Grid, Row, Tab, Tabs } from "react-bootstrap";
import { Diagram, IEntity, Model, parse } from "../archimate-model";
import "./archimate-navigator.css";
import { entityClickedFunc } from "./common";
import ArchimateDiagramView from "./main/archimate-diagram-view";
import ArchimateDiagramTree from "./sidebar/archimate-diagram-tree";
import ArchimateGraphTab from "./sidebar/archimate-graph-tab";
import ArchimateInfo from "./sidebar/archimate-info";
import ModelInfo from "./sidebar/model-info";
import ArchimateSearch from "./sidebar/search";

enum SidebarTab {
  DiagramTreeTab = 1,
  InfoTab,
  SearchTab,
  GraphTab
}

interface IProps {
  modelUrl: string;
  selectedDiagramId?: string;
  selectedEntityId?: string;
}

interface IState {
  autolayout: boolean;
  error?: any;
  graphQuery?: string;
  graphQueryResults: any[];
  model: Model;
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  sidebarTabKey: SidebarTab;
  working?: string;
  loadStart?: Date | undefined;
  parseStart?: Date | undefined;
  parseDone?: Date | undefined;
}

export default class ArchimateNavigator extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    const model = new Model();
    const selectedDiagramId = props.selectedDiagramId || window.location.hash.replace(/^#/, "");
    const selectedDiagram = model.lookupDiagram(selectedDiagramId);
    const selectedEntity = model.lookup(props.selectedEntityId) || selectedDiagram;
    this.state = {
      autolayout: false,
      graphQueryResults: [],
      model,
      selectedDiagram,
      selectedEntity,
      sidebarTabKey: SidebarTab.DiagramTreeTab,
    };
  }

  public render() {
    return (
      <Grid bsClass="container-fluid">
        {this.exceptionView()}
        {this.workingView()}
        <Row className="show-grid">
          <Col xs={12} md={3} className="archimate-view-nav">
            <ModelInfo model={this.state.model} selectedDiagram={this.state.selectedDiagram} />
            <Tabs
              animation={false}
              defaultActiveKey={SidebarTab.DiagramTreeTab}
              activeKey={this.state.sidebarTabKey}
              onSelect={this.handleSelectSidebarTab}
              id="archimate-sidebar-tabs"
            >
              <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
                <ArchimateDiagramTree
                  views={ this.state.model.organizations[this.state.model.organizations.length - 1] }
                  selectedDiagram={this.state.selectedDiagram}
                  entityClicked={this.diagramLinkClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.InfoTab} title="Info">
                <ArchimateInfo
                  entity={this.state.selectedEntity}
                  entityClicked={this.entityClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.SearchTab} title="Search">
                <ArchimateSearch
                  model={this.state.model}
                  resultClicked={this.entityClicked}
                />
              </Tab>
              <Tab eventKey={SidebarTab.GraphTab} title="Graph">
                <ArchimateGraphTab
                  model={this.state.model}
                  selectedDiagram={this.state.selectedDiagram}
                />
              </Tab>
            </Tabs>
          </Col>
          <Col xs={12} md={9} className="archimate-diagram-view">
            <div className="archimate-svg-container">
              <ArchimateDiagramView
                autoLayout={this.state.autolayout}
                key={this.state.selectedDiagram ? this.state.selectedDiagram.id : "archimate-no-diagram"}
                selectedEntity={this.state.selectedEntity}
                selectedDiagram={this.state.selectedDiagram}
                entityClicked={this.entityClicked}
                diagramClicked={this.diagramLinkClicked}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  public componentDidMount() {
    const parser = new DOMParser();
    this.setState({
      loadStart: new Date(),
      parseDone: undefined,
      parseStart: undefined,
      working: "Loading ArchiMate Model"
    });
    fetch(this.props.modelUrl)
      .then((response: Response) => response.text())
      .then((str: string) => {
        this.setState({
          parseStart: new Date(),
          working: "Parsing ArchiMate Model",
        });
        const xmlDocument = parser.parseFromString(str, "application/xml");
          let parsedModel;
          try {
            parsedModel = parse(xmlDocument.children[0].ownerDocument);
          } catch (err) {
            this.setState({
              error: err,
            });
          }
          this.setState({
            parseDone: new Date(),
            working: undefined,
          });
          const curModel: Model = parsedModel || this.state.model;
          const selectedDiagram = curModel.lookupDiagram(this.props.selectedDiagramId || window.location.hash.replace(/^#/, ""));
          const selectedEntity = curModel.lookup(this.props.selectedEntityId) || selectedDiagram || curModel;
          this.setState({
            model: parsedModel || this.state.model,
            selectedDiagram,
            selectedEntity,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            error,
            working: undefined,
          });
        }
      );
  }

  private exceptionView() {
    if (this.state.error === undefined) {
      return undefined;
    }
    if (this.state.error instanceof String) {
      return this.state.error;
    }
    const err = this.state.error as Error;
    const errorMessage = `${err.name}: ${err.message}`;

    return (
    <Row>
      <Col xs={12} md={12}>
        <p>{errorMessage}</p>
      </Col>
    </Row>
    );
  }

  private workingView() {
    if (this.state.working) {
      return(
        <Row>
          <Col xs={12} md={12}>
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{width: "100%"}}>
                {this.state.working}
              </div>
            </div>
            <p>{this.state.working}</p>
          </Col>
        </Row>
        );
    } else {
      return undefined;
    }
  }
  // Called when a sidebar tab is clicked.
  private handleSelectSidebarTab = (eventKey: any) => {
    this.setState({ sidebarTabKey: eventKey });
  };

  private diagramLinkClicked: entityClickedFunc = (entity: IEntity | undefined, event?: React.MouseEvent<Element>) => {
    if (!entity) {
      this.setState({ selectedDiagram: undefined });
      return;
    }
    const diagram = entity as Diagram;
    this.setState({
      selectedDiagram: diagram,
      selectedEntity: diagram,
    });
    if (diagram && diagram.id && diagram.id.length > 0) {
      location.hash = `#${diagram.id}`;
    }
  };

  private entityClicked: entityClickedFunc = (entity: IEntity | undefined, event?: React.MouseEvent<Element>) => {
      if (!entity) {
      this.setState({ selectedEntity: undefined });
      return;
    }
    this.setState({
      selectedEntity: entity,
      sidebarTabKey: SidebarTab.InfoTab
    });
    if (entity instanceof Diagram) {
      this.diagramLinkClicked(entity as Diagram);
    }
  };
}
