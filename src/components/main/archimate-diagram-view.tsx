import * as d3force from "d3-force";
import createPanZoom from "panzoom";
import * as React from "react";
import { Connection, Diagram, DiagramType, IConnection, IEntity, IEntityRef, IViewNode, ViewNode } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import archimateViewNode from "./archimate-view-node";

interface IProps {
  selectedDiagram?: Diagram;
  nodes?: ViewNode[];
  connections?: Connection[];
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
  diagramClicked: entityClickedFunc;
}

interface IState {
  panzoom?: any; // PanZoom.IPanZoom;
  simulation?: d3force.Simulation<ViewNode, Connection> | undefined;
  tickCount: number;
}

export default class ArchimateDiagramView extends React.PureComponent<
  IProps,
  IState
> {
  private nodeWidth = 120; // TODO: this should be from the SVG diagram stuff.
  private svgTopGroup: React.RefObject<SVGGElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      simulation: undefined,
      tickCount: 0,
    };
    this.svgTopGroup = React.createRef();
  }

  public render() {
    if (this.props.selectedDiagram) {
      return (
        <ArchimateSvg
          key={this.props.selectedDiagram.id}
          diagram={this.props.selectedDiagram}
        >
          <g ref={this.svgTopGroup} transform="matrix(1, 0, 0, 1, 5, 5)">
            {this.nodes().map(node => (
              React.createElement(
                archimateViewNode(node),
                {
                  key: node.id,
                  onClicked: this.props.entityClicked,
                  selected: this.nodeIsSelected(node),
                  viewNode: node,
                  x: node.x || node.bounds.left,
                  y: node.y || node.bounds.top,
                }
              )
            ))}
            {this.connections().map(conn => (
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
          </g>
        </ArchimateSvg>
      );
    } else {
      return (
        <div className="jumbotron" id="archimate-splash-content">
          Select a diagram on the left to view.
        </div>
      );
    }
  }

  public componentDidMount() {
    const svgTopGroup = this.svgTopGroup.current;
    if (svgTopGroup && (this.nodes().length > 0)) {
      if (this.state.panzoom === undefined) {
        const panzoom = createPanZoom(svgTopGroup, {});
        panzoom.moveTo(0, 0);
        this.setState({panzoom});
      }
    }
    if (this.isAutoLayout()) {
      this.setState({ simulation: this.autoLayout() });
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.selectedDiagram !== this.props.selectedDiagram) {
      if (this.state.simulation) {
        this.state.simulation.stop();
      }
      this.setState({
        simulation: this.isAutoLayout() ? this.autoLayout() : undefined
      });
    }
  }

  public componentWillUnmount() {
    if (this.state.panzoom) {
      this.state.panzoom.dispose();
      this.setState({panzoom: undefined});
    }
  
    if (this.state.simulation) {
      this.state.simulation.stop();
    }
  }

  private connections(): Connection[] {
    return this.props.selectedDiagram ? this.props.selectedDiagram.connections : [];
  }

  private nodes(): ViewNode[] {
    return this.props.selectedDiagram ? this.props.selectedDiagram.nodes : [];
  }

  private isAutoLayout() {
    return (this.props.selectedDiagram && (this.props.selectedDiagram.type === DiagramType.ModelQuery)) || false;
  }

  // TODO: We have a problem with edges that target an edge.
  private autoLayout(): d3force.Simulation<ViewNode, Connection> | undefined {
    if (this.props.selectedDiagram === undefined) {
      return undefined;
    }

    // TODO: Needs to be a way to handle edges that connect to other edges
    //       current solution is to remove the edge from the selected set.
    const connections = this.props.selectedDiagram.connections.filter(c => c.targetViewNode() instanceof ViewNode);
    const forceLink = d3force
        .forceLink<ViewNode, Connection>(connections)
        .id((node: IViewNode, i: number, nodesData: IViewNode[]) => node.id)
        // TODO: experiment with this
        .distance(this.adjustLinkDistance);
    const extents = this.props.selectedDiagram.calculateMaxExtents();
    return (
      d3force
        .forceSimulation(this.props.selectedDiagram.nodes)
        .force("center", d3force.forceCenter(extents.width / 2, extents.height / 2))
        .force("collide", d3force.forceCollide(this.nodeWidth))
        .force("link", forceLink)
        .force("charge", d3force.forceManyBody())
        .on("tick", this.ticked)
    );
  }

  // TODO: on resize, the center point of the simulation force need to be set.
  // private initResizeHandler = () => {
  //   if (!this.state.simulation) {
  //     return;
  //   }
  //   const resizeClientRect = this.getClientRect();
  //   this.state.simulation.force("center", d3force.forceCenter(resizeClientRect.width / 2, resizeClientRect.height / 2));
  // };

  // TODO: while the simulation is running, periodically reset the view box if
  //       the user hasn't already started to zoom in.
  // private resetViewBoxUnlessZoomed = () => {
  //   if (this.svgTopGroup.current) {
  //   // if (this.svgTopGroup.current.attr("transform") === "translate(0,0)") {
  //     this.resetPanZoom();
  //   }
  // }

  // private resetPanZoom = () => {
  //   if (this.props.selectedDiagram && this.state.panzoom) {
  //     const viewBox = this.props.selectedDiagram.calculateMaxExtents();
  //     // this.state.panzoom.moveTo(viewBox.x, viewBox.y, 1);
  //   }
  // }

  private adjustLinkDistance = (d: IConnection): number => {
    // switch (d.linkType) {
    //   case "CompositionRelationship":
    //   case "AssignmentRelationship":
    //     return 15;
    //   default:
        return 60;
    // }
  };

  /**
   * Called on each "tick" of the D3 Force simulation
   * Not to be called directly
   */
  private ticked = () => {
    // Update…
    this.setState({
      tickCount: this.state.tickCount + 1,
    });
    if (this.state.simulation && this.props.selectedDiagram) {
      const extents = this.props.selectedDiagram.calculateMaxExtents();
      const x = extents.width / 2;
      const y = extents.height / 2;
      this.state.simulation.force("center", d3force.forceCenter(x, y));
      if (this.state.panzoom) {
        let scaleMultiplier = 1;
        if (this.svgTopGroup && this.svgTopGroup.current) {
          const svg = this.svgTopGroup.current;
          if (svg) {
            const clientRect = svg.getClientRects()[0];
            const xScale =  (extents.width + 20) / clientRect.width;
            const yScale =  (extents.height + 20) / clientRect.height;
            scaleMultiplier = Math.min(xScale, yScale);
          }
        }
        this.state.panzoom.zoomTo(x, y, scaleMultiplier)
      }
    }
    this.forceUpdate();
    // this.resetViewBoxUnlessZoomed();
  };

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
}
