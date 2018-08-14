import * as React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import {
  Connection,
  Diagram,
  DiagramType,
  IEntity,
  IEntityRef,
  ViewNode
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import archimateViewNode from "./archimate-view-node";
import ForceLayout from "./force-layout";
import SvgPanZoom, { zoomIn, zoomOut } from "./svg-pan-zoom";

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

export default class ArchimateDiagramView extends React.PureComponent<
  IProps,
  IState
> {
  private svgTopGroup: React.RefObject<SVGGElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      maxX: 0,
      maxY: 0,
      minX: 0,
      minY: 0,
      scale: 1,
      zoomMode: ZoomMode.FitToWindow,
    };
    this.svgTopGroup = React.createRef();
  }

  public render() {
    if (this.props.selectedDiagram) {
      return (
        <>
          <div className="archimate-zoombar" style={{ position: "absolute", top: 0, right: 0 }}>
            <Button onClick={this.onOneHundredPercent}><small>1:1</small></Button>
            <Button onClick={this.onFitToWindow}><Glyphicon glyph="resize-full"/></Button>
            <Button onClick={this.onFitToWidth}><Glyphicon glyph="resize-horizontal"/></Button>
            <Button onClick={this.onZoomIn}><Glyphicon glyph="zoom-in"/></Button>
            <Button onClick={this.onZoomOut}><Glyphicon glyph="zoom-out"/></Button>
            <small>{"  "}{(this.state.scale * 100).toFixed(0)}%</small>
          </div>
          <ArchimateSvg
            key={this.props.selectedDiagram.id}
            diagramName={
              this.props.selectedDiagram ? this.props.selectedDiagram.name : ""
            }
            viewBox={this.viewBox()}
          >
            <ForceLayout 
                centerX={(this.state.maxX - this.state.minX) / 2}
                centerY={(this.state.maxY - this.state.minY) / 2}
                connections={this.props.connections}
                autoLayout={this.isAutoLayout()}
                nodes={this.props.nodes}
                onForceLayoutTick={this.onForceLayoutTick}>
              <SvgPanZoom
                  onExtentsChange={this.onExtentsChange}
                  onZoom={this.onZoom}
                  svgPanZoomRef={this.svgTopGroup}
                  scale={this.state.scale}
                  zoomMode={this.state.zoomMode}
              >
                {this.props.nodes.map(node =>
                  React.createElement(archimateViewNode(node), {
                    key: node.id,
                    onClicked: this.props.entityClicked,
                    selected: this.nodeIsSelected(node),
                    viewNode: node,
                    x: node.x || node.bounds.left,
                    y: node.y || node.bounds.top
                  })
                )}
                {this.props.connections.map(conn => (
                  <ArchimateConnection
                    autoLayout={this.isAutoLayout()}
                    key={conn.id}
                    connection={conn}
                    onClicked={this.props.entityClicked}
                    selected={this.nodeIsSelected(conn)}
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
            <Glyphicon glyph="arrow-left" />
            &nbsp; Select a diagram on the left to view.
          </p>
        </div>
      );
    }
  }

  private isAutoLayout() {
    return (
      (this.props.selectedDiagram &&
        this.props.selectedDiagram.type === DiagramType.ModelQuery) ||
      false
    );
  }

  private nodeIsSelected(node: IEntityRef): boolean {
    if (this.props.selectedEntity === undefined) {
      return false;
    }
    const nodeElement = node.entityInstance();
    if (nodeElement === undefined) {
      return false;
    }
    return this.props.selectedEntity.id === nodeElement.id;
  }

  private onFitToWindow = () => {
    this.setState({zoomMode: ZoomMode.FitToWindow});
  }

  private onFitToWidth = () => {
    this.setState({zoomMode: ZoomMode.FitToWindowWidth});
  }

  private onOneHundredPercent = () => {
    this.setState({zoomMode: ZoomMode.OneToOne});
  }

  // TODO: This needs to change
  private onZoomIn = () => {
    this.setState({
      scale: zoomIn(this.state.scale),
      zoomMode: ZoomMode.UserZoom,
    })
  }

  // TODO: This needs to change
  private onZoomOut = () => {
    this.setState({
      scale: zoomOut(this.state.scale),
      zoomMode: ZoomMode.UserZoom,
    })
  }

  // Called when the Force Layout has updated node positions
  private onForceLayoutTick = () => {
    this.onFitToWindow();
  }

  // Called when the PanZoom wheel event has initiated a zoom
  private onZoom = (scale: number) => {
    if ((this.state.scale !== scale) || (this.state.zoomMode !== ZoomMode.UserZoom)) {
      this.setState({scale, zoomMode: ZoomMode.UserZoom});
    }
  }

  private onExtentsChange = (minX: number, maxX: number, minY: number, maxY: number) => {
    if ((this.state.minX !== minX) ||
        (this.state.maxX !== maxX) ||
        (this.state.minY !== minY) ||
        (this.state.maxY !== maxY)) {
      this.setState({minX, maxX, minY, maxY});
    }
  }

  private viewBox(): SVGRect {
    return new DOMRect(
      this.state.minX,
      this.state.minY,
      this.state.maxY - this.state.minY,
      this.state.maxX - this.state.minX
    );
  }
}
