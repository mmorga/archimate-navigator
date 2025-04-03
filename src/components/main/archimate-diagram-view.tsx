import { useCallback, useEffect, useRef, useState } from "react";
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
  calculateMaxExtents,
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import { ArchimateViewNode } from "./archimate-view-node";
import ForceLayout from "./force-layout";
import SvgPanZoom, { numbersDiffer, zoomIn, zoomOut } from "./svg-pan-zoom";

export enum ZoomMode {
  OneToOne,
  FitToWindow,
  FitToWindowWidth,
  UserZoom,
}

export default function ArchimateDiagramView({
  selectedDiagram,
  nodes,
  connections,
  selectedEntity,
  entityClicked,
}: {
  selectedDiagram?: Diagram;
  nodes: ViewNode[];
  connections: Connection[];
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
}) {
  const svgTopGroup = useRef<SVGGElement | null>(null);
  const [zoomMode, setZoomMode] = useState(ZoomMode.FitToWindow);
  const [scale, setScale] = useState(1);
  const [extents, setExtents] = useState(
    calculateMaxExtents(nodes, connections),
  );

  const isAutoLayout = () => {
    return (
      (selectedDiagram && selectedDiagram.type === DiagramType.ModelQuery) ||
      false
    );
  };

  const nodeIsSelected = (node: IEntityRef): boolean => {
    if (selectedEntity === undefined) {
      return false;
    }
    const nodeElement = node.entityInstance();
    if (nodeElement === undefined) {
      return false;
    }
    return selectedEntity.id === nodeElement.id;
  };

  const onFitToWindow = () => {
    setZoomMode(ZoomMode.FitToWindow);
  };

  const onFitToWidth = () => {
    setZoomMode(ZoomMode.FitToWindowWidth);
  };

  const onOneHundredPercent = () => {
    setZoomMode(ZoomMode.OneToOne);
  };

  const onZoomIn = () => {
    setZoomMode(ZoomMode.UserZoom);
    setScale(zoomIn(scale));
  };

  const onZoomOut = () => {
    setZoomMode(ZoomMode.UserZoom);
    setScale(zoomOut(scale));
  };

  const onForceLayoutTick = () => {
    onFitToWindow();
    setChangedExtents();
  };

  const onZoom = (toScale: number) => {
    if (toScale !== scale || zoomMode !== ZoomMode.UserZoom) {
      setScale(toScale);
      setZoomMode(ZoomMode.UserZoom);
    }
  };

  const viewBox = (): SVGRect => {
    return new DOMRect(
      extents.minX,
      extents.minY,
      extents.maxY - extents.minY,
      extents.maxX - extents.minX,
    );
  };

  const setChangedExtents = useCallback(() => {
    const ext = calculateMaxExtents(nodes, connections);
    if (extentsDiffer(extents, ext)) {
      setExtents(ext);
    }
  }, [connections, extents, nodes]);

  useEffect(() => {
    setChangedExtents();
  }, [selectedDiagram, extents, setChangedExtents]);

  if (selectedDiagram) {
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
            {(scale * 100).toFixed(0)}%
          </small>
        </div>
        <ArchimateSvg
          key={selectedDiagram.id}
          diagramName={selectedDiagram ? selectedDiagram.name : ""}
          viewBox={viewBox()}
        >
          <ForceLayout
            centerX={(extents.maxX - extents.minX) / 2}
            centerY={(extents.maxY - extents.minY) / 2}
            connections={connections}
            autoLayout={isAutoLayout()}
            nodes={nodes}
            onForceLayoutTick={onForceLayoutTick}
          >
            <SvgPanZoom
              maxX={extents.maxX}
              maxY={extents.maxY}
              minX={extents.minX}
              minY={extents.minY}
              onZoom={onZoom}
              svgPanZoomRef={svgTopGroup}
              scale={scale}
              zoomMode={zoomMode}
            >
              {nodes.map((node) => (
                <ArchimateViewNode
                  key={node.id}
                  viewNode={node}
                  onClicked={entityClicked}
                  selected={nodeIsSelected(node)}
                  x={node.x || node.bounds.left}
                  y={node.y || node.bounds.top}
                />
              ))}
              {connections.map((conn) => (
                <ArchimateConnection
                  autoLayout={isAutoLayout()}
                  key={conn.id}
                  connection={conn}
                  onClicked={entityClicked}
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
}

export function extentsDiffer(a: IExtents, b: IExtents) {
  return (
    numbersDiffer(a.maxX, b.maxX) ||
    numbersDiffer(a.maxY, b.maxY) ||
    numbersDiffer(a.minX, b.minX) ||
    numbersDiffer(a.minY, b.minY)
  );
}
