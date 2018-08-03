import * as React from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { Diagram, IEntity, LogicError, Model, parse } from "../archimate-model";
import "./archimate-navigator.css";
import ArchimateDiagramView from "./main/archimate-diagram-view";
import Sidebar, { SidebarTab } from "./sidebar/sidebar";

interface IProps {
  modelUrl: string; // URL of model to load
  selectedDiagramId?: string; // diagram id to load from model
  selectedEntityId?: string; // entity id to select
}

interface IState {
  error?: any; // Any error loading the model
  loadStart?: number; // Timestamp when started loading the model
  loadTime?: number; // Time spent loading the model
  model: Model; // Currently loaded model
  parseDone?: number; // Timestamp when parse complete
  parseTime?: number; // Time spent parsing the model
  parseStart?: number; // Timestamp when parse started
  selectedDiagram?: Diagram; // Currently selected diagram
  selectedEntity?: IEntity; // Currently selected entity (model, element, relationship, diagram)
  sidebarTabKey: SidebarTab; // Currently selected sidebar tab
  sidebarWidth: number; // Current pixel width of the sidebar
  working?: string; // Progress bar message while loading/parsing
}

export default class ArchimateNavigator extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    const model = new Model();
    const selectedDiagramId =
      props.selectedDiagramId || window.location.hash.replace(/^#/, "");
    const selectedDiagram = model.lookupDiagram(selectedDiagramId);
    const selectedEntity =
      model.lookup(props.selectedEntityId) || selectedDiagram;
    this.state = {
      model,
      selectedDiagram,
      selectedEntity,
      sidebarTabKey: SidebarTab.DiagramTreeTab,
      sidebarWidth: 385
    };
  }

  public render() {
    return (
      <React.Fragment>
        {this.exceptionView()}
        {this.workingView()}
        <div className="archimate-row">
          <Sidebar
            diagramLinkClicked={this.onDiagramLinkClick}
            entityClicked={this.onEntityClick}
            model={this.state.model}
            onDiagramUpdated={this.onDiagramLinkClick}
            onTabSelected={this.onSidebarTabSelected}
            selectedDiagram={this.state.selectedDiagram}
            selectedEntity={this.state.selectedEntity}
            sidebarTabKey={this.state.sidebarTabKey}
          />
          <div className="archimate-diagram-view">
            <div className="archimate-svg-container">
              <ArchimateDiagramView
                key={
                  this.state.selectedDiagram
                    ? this.state.selectedDiagram.id
                    : "archimate-no-diagram"
                }
                selectedEntity={this.state.selectedEntity}
                selectedDiagram={this.state.selectedDiagram}
                nodes={this.state.selectedDiagram ? this.state.selectedDiagram.nodes : undefined}
                connections={this.state.selectedDiagram ? this.state.selectedDiagram.connections : undefined}
                entityClicked={this.onEntityClick}
                diagramClicked={this.onDiagramLinkClick}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  public componentDidMount() {
    const parser = new DOMParser();
    this.setState({
      loadStart: Date.now(),
      loadTime: undefined,
      parseDone: undefined,
      parseStart: undefined,
      parseTime: undefined,
      working: "Loading ArchiMate Model"
    });
    fetch(this.props.modelUrl)
      .then((response: Response) => response.text())
      .then(
        (str: string) => {
          this.setState({
            loadTime: (Date.now() - (this.state.loadStart as number)) / 1000.0,
            parseStart: Date.now(),
            working: "Parsing ArchiMate Model"
          });
          const xmlDocument = parser.parseFromString(str, "application/xml");
          let parsedModel;
          try {
            parsedModel = parse(xmlDocument.children[0].ownerDocument);
          } catch (err) {
            this.setState({
              error: err
            });
          }
          this.setState({
            parseDone: Date.now(),
            parseTime:
              (Date.now() - (this.state.parseStart as number)) / 1000.0,
            working: undefined
          });
          const curModel: Model = parsedModel || this.state.model;
          const selectedDiagram = curModel.lookupDiagram(
            this.props.selectedDiagramId ||
              window.location.hash.replace(/^#/, "")
          );
          const selectedEntity =
            curModel.lookup(this.props.selectedEntityId) ||
            selectedDiagram ||
            curModel;
          this.setState({
            model: parsedModel || this.state.model,
            selectedDiagram,
            selectedEntity
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            error,
            working: undefined
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
      <Alert bsStyle="danger" onDismiss={this.onCloseException}>
        <h4>An Exception Occurred</h4>
        <p> {errorMessage} </p>
        <p>
          <Button onClick={this.onCloseException}>Close</Button>
        </p>
      </Alert>
    );
  }

  private onCloseException = () => {
    this.setState({ error: undefined });
  };

  private workingView() {
    return (
      <Modal
        show={this.state.working ? true : false}
        onHide={this.onWorkingViewHide}
      >
        <Modal.Header>
          <Modal.Title>Loading...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped active"
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {this.state.working}
            </div>
          </div>
          <p>{this.state.working}</p>
        </Modal.Body>
      </Modal>
    );
  }

  private onWorkingViewHide = () => {
    this.setState({ working: undefined });
  };

  private onDiagramLinkClick = (
    entity: IEntity | undefined,
    event?: React.MouseEvent<Element>
  ) => {
    if (!entity) {
      throw new LogicError("diagram wasn't passed");
      this.setState({ selectedDiagram: undefined });
      return;
    }
    const diagram = entity as Diagram;
    this.setState({
      selectedDiagram: diagram,
      selectedEntity: diagram
    });
    if (diagram && diagram.id && diagram.id.length > 0) {
      location.hash = `#${diagram.id}`;
    }
  };

  private onEntityClick = (
    entity: IEntity | undefined,
    event?: React.MouseEvent<Element>
  ) => {
    if (!entity) {
      this.setState({ selectedEntity: undefined });
      return;
    }
    this.setState({
      selectedEntity: entity,
      sidebarTabKey: SidebarTab.InfoTab
    });
    if (entity instanceof Diagram) {
      this.onDiagramLinkClick(entity as Diagram);
    }
  };

  // Called when a sidebar tab is clicked.
  private onSidebarTabSelected = (eventKey: any) => {
    this.setState({ sidebarTabKey: eventKey });
  };
}
