import "./archimate-navigator.css";
import { Alert, Button, Modal } from "react-bootstrap";
import { Container, Section, Bar } from "@column-resizer/react";
import {
  Diagram,
  Element,
  ElementType,
  elementTypesForViewpoint,
  IEntity,
  initQuery,
  Layer,
  LogicError,
  Model,
  parse,
  ParserError,
  Query,
  run,
  UnsupportedFormat,
  ViewNode,
  viewpointForElementTypes,
  ViewpointType,
} from "../archimate-model";
import { useState, useEffect } from "react";
import ArchimateDiagramView from "./main/archimate-diagram-view";
import Sidebar, { SidebarTab } from "./sidebar/sidebar";
import { Set } from "immutable";

export default function ArchimateNavigator({
  modelUrl,
}: {
  modelUrl: string; // URL of model to load
}) {
  // const [windowHash, setWindowHash] = useState(window.location.hash);
  // window.addEventListener("hashchange", () => {
  //   setWindowHash(window.location.hash);
  // });

  const [error, setError] = useState<string | Error>();
  const [model, setModel] = useState<Model | undefined>(undefined);
  const [query, setQuery] = useState<Query | undefined>(undefined);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | undefined>(
    undefined,
  );
  const [selectedEntity, setSelectedEntity] = useState<IEntity | undefined>(
    undefined,
  );
  const [sidebarTabKey, setSidebarTabKey] = useState<SidebarTab>(
    SidebarTab.DiagramTreeTab,
  );
  const [working, setWorking] = useState<string>();

  useEffect(() => {
    const parser = new DOMParser();
    setWorking("Loading ArchiMate Model");

    fetch(modelUrl)
      .then((response: Response) => response.text())
      .then(
        (modelXml: string) => {
          setWorking("Parsing ArchiMate Model");

          const xmlDocument = parser.parseFromString(
            modelXml,
            "application/xml",
          );
          try {
            if (xmlDocument.children[0].ownerDocument) {
              const parsedModel = parse(xmlDocument.children[0].ownerDocument);
              if (parsedModel) {
                const newSelectedDiagram = undefined;
                // parsedModel.lookupDiagram(
                //   windowHash.replace(/^#/, ""),
                // );

                setModel(parsedModel);
                setQuery(initQuery(parsedModel));
                setSelectedDiagram(newSelectedDiagram);
                setSelectedEntity(newSelectedDiagram);
              }
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
          setWorking(undefined);
        },
        (err) => {
          setError(err);
          setWorking(undefined);
        },
      );
  }, [modelUrl]);

  // useEffect(() => {
  //   window.location.hash = windowHash;
  // }, [windowHash]);

  const onQueryNameChanged = (name: string) => {
    if (query) {
      setQuery({
        ...query,
        name: name,
      });
    }
  };

  const onViewpointChanged = (viewpointType: ViewpointType) => {
    if (query) {
      onQueryChanged({
        ...query,
        elementTypes: Set<ElementType>(
          elementTypesForViewpoint(viewpointType, query.elementTypes),
        ),
        viewpointType,
      });
    }
  };

  const onPathDepthChanged = (depth: number) => {
    if (query) {
      onQueryChanged({
        ...query,
        pathDepth: depth,
      });
    }
  };

  const onLayerFilterChanged = (layer: Layer, checked: boolean) => {
    if (query) {
      let layerFilter;
      if (checked) {
        layerFilter = query.layerFilter.add(layer);
      } else {
        layerFilter = query.layerFilter.remove(layer);
      }
      onQueryChanged({
        ...query,
        layerFilter,
      });
    }
  };

  const onElementTypeFilterChanged = (elementType: ElementType) => {
    if (query) {
      const elementTypes = query.elementTypes.includes(elementType)
        ? query.elementTypes.delete(elementType)
        : query.elementTypes.add(elementType);
      onQueryChanged({
        ...query,
        elementTypes,
        viewpointType: viewpointForElementTypes(elementTypes),
      });
    }
  };

  const onAddElement = (element: Element) => {
    if (query) {
      onQueryChanged({
        ...query,
        elements: query.elements.add(element),
      });
    }
  };

  const onRemoveElement = (element: Element) => {
    if (query) {
      onQueryChanged({
        ...query,
        elements: query.elements.remove(element),
      });
    }
  };

  const onQueryChanged = (queryUpdate: Query) => {
    if (queryUpdate && model) {
      setQuery(queryUpdate);
      const diagram = run(queryUpdate, model);
      onDiagramLinkClick(diagram);
    }
  };

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
    // if (diagram && diagram.id && diagram.id.length > 0) {
    //   setWindowHash(`#${diagram.id}`);
    //   // window.location.hash = `#${diagram.id}`;
    // }
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
      <Container>
        <Section minSize={0} defaultSize={385}>
          <Sidebar
            diagramLinkClicked={onDiagramLinkClick}
            entityClicked={onEntityClick}
            model={model}
            query={query}
            onTabSelected={onSidebarTabSelected}
            selectedDiagram={selectedDiagram}
            selectedEntity={selectedEntity}
            sidebarTabKey={sidebarTabKey}
            onQueryNameChanged={onQueryNameChanged}
            onViewpointChanged={onViewpointChanged}
            onPathDepthChanged={onPathDepthChanged}
            onLayerFilterChanged={onLayerFilterChanged}
            onElementTypeFilterChanged={onElementTypeFilterChanged}
            onAddElement={onAddElement}
            onRemoveElement={onRemoveElement}
          />
        </Section>
        <Bar
          size={10}
          style={{ background: "currentColor", cursor: "col-resize" }}
        />
        <Section minSize={100}>
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
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
