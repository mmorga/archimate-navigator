import * as React from "react";
import { Button } from "react-bootstrap";
import {
  ArrowsFullscreen,
  ArrowsExpand,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
} from "react-bootstrap-icons";
import {
  Connection,
  Diagram,
  DiagramType,
  IEntity,
  IEntityRef,
  IExtents,
  ViewNode,
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import { ArchimateViewNode } from "./archimate-view-node";
import ForceLayout from "./force-layout";
import SvgPanZoom, { numbersDiffer, zoomIn, zoomOut } from "./svg-pan-zoom";

interface IProps {
  selectedDiagram?: Diagram;
  nodes: ViewNode[];
  connections: Connection[];
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
  diagramClicked: entityClickedFunc;
}

enum ZoomMode {
  OneToOne,
  FitToWindow,
  FitToWindowWidth,
  UserZoom,
}

interface IState {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  scale: number;
  zoomMode: ZoomMode;
}

const diagramExtents = (dia: Diagram | undefined): IExtents => {
  return dia
    ? dia.calculateMaxExtents()
    : { maxX: 0, maxY: 0, minX: 0, minY: 0 };
};

const ArchimateDiagramView: React.FC<IProps> = (props) => {
  const svgTopGroup = React.useRef<SVGGElement | null>(null);
  const ext = diagramExtents(props.selectedDiagram);
  const [state, setState] = React.useState<IState>({
    maxX: ext.maxX,
    maxY: ext.maxY,
    minX: ext.minX,
    minY: ext.minY,
    scale: 1,
    zoomMode: ZoomMode.FitToWindow,
  });

  const isAutoLayout = () => {
    return (
      (props.selectedDiagram &&
        props.selectedDiagram.type === DiagramType.ModelQuery) ||
      false
    );
  };

  const nodeIsSelected = (node: IEntityRef): boolean => {
    if (props.selectedEntity === undefined) {
      return false;
    }
    const nodeElement = node.entityInstance();
    if (nodeElement === undefined) {
      return false;
    }
    return props.selectedEntity.id === nodeElement.id;
  };

  const onFitToWindow = () => {
    setState((prev) => ({ ...prev, zoomMode: ZoomMode.FitToWindow }));
  };

  const onFitToWidth = () => {
    setState((prev) => ({ ...prev, zoomMode: ZoomMode.FitToWindowWidth }));
  };

  const onOneHundredPercent = () => {
    setState((prev) => ({ ...prev, zoomMode: ZoomMode.OneToOne }));
  };

  const onZoomIn = () => {
    setState((prev) => ({
      ...prev,
      scale: zoomIn(prev.scale),
      zoomMode: ZoomMode.UserZoom,
    }));
  };

  const onZoomOut = () => {
    setState((prev) => ({
      ...prev,
      scale: zoomOut(prev.scale),
      zoomMode: ZoomMode.UserZoom,
    }));
  };

  const onForceLayoutTick = () => {
    onFitToWindow();
  };

  const onZoom = (scale: number) => {
    if (state.scale !== scale || state.zoomMode !== ZoomMode.UserZoom) {
      setState((prev) => ({ ...prev, scale, zoomMode: ZoomMode.UserZoom }));
    }
  };

  const viewBox = (): SVGRect => {
    return new DOMRect(
      state.minX,
      state.minY,
      state.maxY - state.minY,
      state.maxX - state.minX,
    );
  };

  React.useEffect(() => {
    const ext = diagramExtents(props.selectedDiagram);
    if (
      numbersDiffer(state.maxX, ext.maxX) ||
      numbersDiffer(state.maxY, ext.maxY) ||
      numbersDiffer(state.minX, ext.minX) ||
      numbersDiffer(state.minY, ext.minY)
    ) {
      setState((prev) => ({
        ...prev,
        maxX: ext.maxX,
        maxY: ext.maxY,
        minX: ext.minX,
        minY: ext.minY,
      }));
    }
  }, [props.selectedDiagram]);

  if (props.selectedDiagram) {
    return (
      <>
        <div
          className="archimate-zoombar"
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <Button onClick={onOneHundredPercent}>
            <small>1:1</small>
          </Button>
          <Button onClick={onFitToWindow}>
            <ArrowsFullscreen />
          </Button>
          <Button onClick={onFitToWidth}>
            <ArrowsExpand />
          </Button>
          <Button onClick={onZoomIn}>
            <ZoomIn />
          </Button>
          <Button onClick={onZoomOut}>
            <ZoomOut />
          </Button>
          <small>
            {"  "}
            {(state.scale * 100).toFixed(0)}%
          </small>
        </div>
        <ArchimateSvg
          key={props.selectedDiagram.id}
          diagramName={props.selectedDiagram ? props.selectedDiagram.name : ""}
          viewBox={viewBox()}
        >
          <ForceLayout
            centerX={(state.maxX - state.minX) / 2}
            centerY={(state.maxY - state.minY) / 2}
            connections={props.connections}
            autoLayout={isAutoLayout()}
            nodes={props.nodes}
            onForceLayoutTick={onForceLayoutTick}
          >
            <SvgPanZoom
              maxX={state.maxX}
              maxY={state.maxY}
              minX={state.minX}
              minY={state.minY}
              onZoom={onZoom}
              svgPanZoomRef={svgTopGroup}
              scale={state.scale}
              zoomMode={state.zoomMode}
            >
              {props.nodes.map((node) => (
                <ArchimateViewNode
                  viewNode={node}
                  onClicked={props.entityClicked}
                  selected={nodeIsSelected(node)}
                  x={node.x || node.bounds.left}
                  y={node.y || node.bounds.top}
                />
              ))}
              {props.connections.map((conn) => (
                <ArchimateConnection
                  autoLayout={isAutoLayout()}
                  key={conn.id}
                  connection={conn}
                  onClicked={props.entityClicked}
                  selected={nodeIsSelected(conn)}
                  fromX={conn.sourceBounds().left}
                  fromY={conn.sourceBounds().top}
                  toX={conn.targetBounds().left}
                  toY={conn.targetBounds().top}
                />
              ))}
            </SvgPanZoom>
          </ForceLayout>
        </ArchimateSvg>
      </>
    );
  } else {
    return (
      <div
        className="jumbotron"
        style={{ paddingLeft: "2em", paddingRight: "2em" }}
      >
        <h1>ArchiMate Navigator</h1>
        <p>
          <ArrowLeft />
          &nbsp; Select a diagram on the left to view.
        </p>
      </div>
    );
  }
};

export default ArchimateDiagramView;
