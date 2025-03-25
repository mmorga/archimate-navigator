import { useState, useEffect } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import {
  Diagram,
  IEntity,
  LogicError,
  Model,
  parse,
  ParserError,
  UnsupportedFormat,
  ViewNode,
} from "../archimate-model";
import "./archimate-navigator.css";
import ArchimateDiagramView from "./main/archimate-diagram-view";
import Sidebar, { SidebarTab } from "./sidebar/sidebar";

interface IProps {
  modelUrl: string; // URL of model to load
  selectedDiagramId?: string; // diagram id to load from model
  selectedEntityId?: string; // entity id to select
}

export default function ArchimateNavigator({
  modelUrl,
  selectedDiagramId,
  selectedEntityId,
}: IProps) {
  const initialModel = new Model();
  const initialDiagramId =
    selectedDiagramId || window.location.hash.replace(/^#/, "");
  const initialDiagram = initialModel.lookupDiagram(initialDiagramId);
  const initialEntity = initialModel.lookup(selectedEntityId) || initialDiagram;

  const [error, setError] = useState<string | Error>();
  // const [loadStart, setLoadStart] = useState<number>();
  // const [loadTime, setLoadTime] = useState<number>();
  const [model, setModel] = useState<Model>(initialModel);
  // const [parseDone, setParseDone] = useState<number>();
  // const [parseTime, setParseTime] = useState<number>();
  // const [parseStart, setParseStart] = useState<number>();
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | undefined>(
    initialDiagram,
  );
  const [selectedEntity, setSelectedEntity] = useState<IEntity | undefined>(
    initialEntity,
  );
  const [sidebarTabKey, setSidebarTabKey] = useState<SidebarTab>(
    SidebarTab.DiagramTreeTab,
  );
  // const [sidebarWidth] = useState<number>(385);
  const [working, setWorking] = useState<string>();

  useEffect(() => {
    const parser = new DOMParser();
    // setLoadStart(Date.now());
    // setLoadTime(undefined);
    // setParseDone(undefined);
    // setParseStart(undefined);
    // setParseTime(undefined);
    setWorking("Loading ArchiMate Model");

    fetch(modelUrl)
      .then((response: Response) => response.text())
      .then(
        (str: string) => {
          // setLoadTime((Date.now() - (loadStart as number)) / 1000.0);
          // setParseStart(Date.now());
          setWorking("Parsing ArchiMate Model");

          const xmlDocument = parser.parseFromString(str, "application/xml");
          let parsedModel;
          try {
            if (xmlDocument.children[0].ownerDocument) {
              parsedModel = parse(xmlDocument.children[0].ownerDocument);
            } else {
              setError("ArchiMate Model Document was null");
            }
          } catch (err) {
            if (
              err instanceof UnsupportedFormat ||
              err instanceof ParserError
            ) {
              setError(err);
            } else {
              throw err;
            }
          }

          // setParseDone(Date.now());
          // setParseTime((Date.now() - (parseStart as number)) / 1000.0);
          setWorking(undefined);

          const curModel: Model = parsedModel || model;
          const newSelectedDiagram = curModel.lookupDiagram(
            selectedDiagramId || window.location.hash.replace(/^#/, ""),
          );
          const newSelectedEntity =
            curModel.lookup(selectedEntityId) || newSelectedDiagram || curModel;

          setModel(parsedModel || model);
          setSelectedDiagram(newSelectedDiagram);
          setSelectedEntity(newSelectedEntity);
        },
        (error) => {
          setError(error);
          setWorking(undefined);
        },
      );
  }, [modelUrl]);

  const onCloseException = () => setError(undefined);

  const onWorkingViewHide = () => setWorking(undefined);

  const onDiagramLinkClick = (entity: IEntity | undefined) => {
    if (!entity) {
      setSelectedDiagram(undefined);
      throw new LogicError("diagram wasn't passed");
    }
    const diagram = entity as Diagram;
    setSelectedDiagram(diagram);
    setSelectedEntity(diagram);
    if (diagram && diagram.id && diagram.id.length > 0) {
      window.location.hash = `#${diagram.id}`;
    }
  };

  const onEntityClick = (entity: IEntity | undefined) => {
    if (!entity) {
      setSelectedEntity(undefined);
      return;
    }
    setSelectedEntity(entity);
    setSidebarTabKey(SidebarTab.InfoTab);
    if (entity instanceof Diagram) {
      onDiagramLinkClick(entity as Diagram);
    }
  };

  const onSidebarTabSelected = (eventKey: string | null) => {
    if (eventKey) {
      const idx = parseInt(eventKey);
      setSidebarTabKey(idx);
    }
  };

  const exceptionView = () => {
    if (error === undefined) {
      return undefined;
    }
    if (error instanceof String) {
      return error;
    }
    const err = error as Error;
    const errorMessage = `${err.name}: ${err.message}`;

    return (
      <Alert variant="danger" onClose={onCloseException}>
        <h4>An Exception Occurred</h4>
        <p> {errorMessage} </p>
        <p>
          <Button onClick={onCloseException}>Close</Button>
        </p>
      </Alert>
    );
  };

  const workingView = () => {
    return (
      <Modal show={working ? true : false} onHide={onWorkingViewHide}>
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
              {working}
            </div>
          </div>
          <p>{working}</p>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      {exceptionView()}
      {workingView()}
      <div className="archimate-row">
        <Sidebar
          diagramLinkClicked={onDiagramLinkClick}
          entityClicked={onEntityClick}
          model={model}
          onDiagramUpdated={onDiagramLinkClick}
          onTabSelected={onSidebarTabSelected}
          selectedDiagram={selectedDiagram}
          selectedEntity={selectedEntity}
          sidebarTabKey={sidebarTabKey}
        />
        <div className="archimate-diagram-view">
          <div className="archimate-svg-container">
            <ArchimateDiagramView
              key={
                selectedDiagram ? selectedDiagram.id : "archimate-no-diagram"
              }
              selectedEntity={selectedEntity}
              selectedDiagram={selectedDiagram}
              nodes={selectedDiagram ? selectedDiagram.nodes : []}
              connections={
                selectedDiagram
                  ? selectedDiagram.connections.filter(
                      (c) => c.targetViewNode() instanceof ViewNode,
                    )
                  : []
              }
              entityClicked={onEntityClick}
              diagramClicked={onDiagramLinkClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}
