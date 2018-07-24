import * as d3force from "d3-force";
import * as React from "react";
import { Connection, Diagram, IConnection, IEntity, IEntityRef, IViewNode, ViewNode } from "../../archimate-model";
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
  autoLayout?: boolean;
}

interface IState {
  loadedDiagram?: Diagram;
  selectedEntity?: IEntity;
  svg: void | Document;
  error?: any;
  loadedSrc?: string;
  isCached?: boolean;
  simulation?: d3force.Simulation<ViewNode, Connection> | undefined;
  tickCount: number;
  nodes: ViewNode[];
  connections: Connection[];
}

export default class ArchimateDiagramView extends React.PureComponent<
  IProps,
  IState
> {
  private nodeWidth = 120;

  constructor(props: IProps) {
    super(props);
    this.state = {
      connections: this.props.selectedDiagram ? this.props.selectedDiagram.connections : [],
      isCached: false,
      nodes: this.props.selectedDiagram ? this.props.selectedDiagram.nodes : [],
      selectedEntity: this.props.selectedEntity,
      svg: undefined,
      tickCount: 0,
    };
  }

  public render() {
    if (this.props.selectedDiagram) {
      return (
        <ArchimateSvg
          key={this.props.selectedDiagram.id}
          diagram={this.props.selectedDiagram}
        >
          {this.state.nodes.map(node => (
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
          {this.state.connections.map(conn => (
            <ArchimateConnection
                key={conn.id}
                connection={conn}
                onClicked={this.props.entityClicked}
                selected={this.nodeIsSelected(conn)}
            />
          ))}
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
    if (this.props.autoLayout && (this.state.simulation === undefined)) {
      this.setState({simulation: this.autoLayout()});
    }
  }

  public componentWillUnmount() {
    if (this.state.simulation) {
      this.state.simulation.stop();
    }
  }

  // TODO: We have a problem with edges that target an edge.
  private autoLayout(): d3force.Simulation<ViewNode, Connection> | undefined {
    if (this.props.selectedDiagram === undefined) {
      return undefined;
    }
    // TODO: Make this better
    // const svgEl = document.querySelector("svg");
    // if (svgEl === null) {
    //   return false;
    // }
    // const clientRect = svgEl.getClientRects()[0];

    // TODO: Needs to be a way to handle edges that connect to other edges
    //       current solution is to remove the edge from the selected set.
    const connections = this.props.selectedDiagram.connections.filter(c => c.targetViewNode() instanceof ViewNode);
    const forceLink = d3force
        .forceLink<ViewNode, Connection>(connections)
        .id((node: IViewNode, i: number, nodesData: IViewNode[]) => node.id)
        // TODO: experiment with this
        .distance(this.adjustLinkDistance);
    return (
      d3force
        .forceSimulation(this.props.selectedDiagram.nodes)
        // .force(
        //   "center",
        //   d3force.forceCenter(clientRect.width / 2, clientRect.height / 2)
        // )
        .force("collide", d3force.forceCollide(this.nodeWidth))
        .force(
          "link",
          forceLink
        )
        .force("charge", d3force.forceManyBody())
        .on("tick", this.ticked)
    );

    // this.graphNodes.updateNodes(graph.nodes);
    // this.graphLinks.updateLinks(graph.links);

    // TODO: on resize, the center point of the simulation force need to be set.
    // initResizeHandler(() => {
    //     const resizeClientRect = curDiagramParent.getClientRects()[0];
    //     simulation.force("center", d3force.forceCenter(resizeClientRect.width / 2, resizeClientRect.height / 2));
    // });

    // TODO: while the simulation is running, periodically reset the view box if
    //       the user hasn't already started to zoom in.
    // function resetViewBoxUnlessZoomed() {
    //     if (graphG.attr("transform") === "translate(0,0)") {
    //         resetViewBox(svgEl);
    //     }
    // }
  }

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
      connections: (this.props.selectedDiagram as Diagram).connections,
      nodes: (this.props.selectedDiagram as Diagram).nodes,
      tickCount: this.state.tickCount + 1,
    })
    this.forceUpdate();
    // resetViewBoxUnlessZoomed();  // TODO: hook this up with Svg class instance
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
