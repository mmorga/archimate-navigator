import * as d3force from "d3-force";
import { is, Set } from "immutable";
import { PureComponent, ReactNode } from "react";
import { Connection, VIEW_NODE_WIDTH, ViewNode } from "../../archimate-model";

type IProps = {
  connections: Connection[];
  autoLayout: boolean;
  nodes: ViewNode[];
  onForceLayoutTick?: () => void;
  children?: ReactNode;
};

const DEFAULT_DISTANCE = 30; // Default distance for D3 Force simulations

export default class ForceLayout extends PureComponent<IProps> {
  private forceLink?: d3force.ForceLink<ViewNode, Connection>;
  private simulation?: d3force.Simulation<ViewNode, Connection>;
  private prevNodes: Set<string>;
  private prevConnections: Set<string>;

  constructor(props: IProps) {
    super(props);
    this.prevNodes = Set<string>();
    this.prevConnections = Set<string>();
  }

  public render() {
    return this.props.children;
  }

  public componentDidMount() {
    if (!this.props.autoLayout) {
      return;
    }
    // TODO: look into doing this in a web worker
    this.forceLink = d3force
      .forceLink<ViewNode, Connection>(this.props.connections)
      .id((node: ViewNode) => node.id)
      .distance(this.adjustLinkDistance);
    this.simulation = d3force
      .forceSimulation(this.props.nodes)
      .force("center", d3force.forceCenter(0, 0))
      .force("collide", d3force.forceCollide(VIEW_NODE_WIDTH))
      .force("link", this.forceLink)
      .force("charge", d3force.forceManyBody())
      .on("tick", this.ticked);
  }

  public componentDidUpdate() {
    if (!this.props.autoLayout) {
      if (this.simulation) {
        this.simulation.stop();
      }
      return;
    }

    // If our set of nodes and connections haven't changed, then nothing to do here.
    const nextConnections = Set.of<string>(
      ...this.props.connections.map((c) => c.id),
    );
    const nextNodes = Set.of<string>(...this.props.nodes.map((n) => n.id));
    if (
      is(this.prevConnections, nextConnections) &&
      is(this.prevNodes, nextNodes)
    ) {
      return;
    }
    this.prevNodes = nextNodes;
    this.prevConnections = nextConnections;

    if (this.simulation) {
      this.simulation.nodes(this.props.nodes);
      if (this.forceLink) {
        this.forceLink.links(this.props.connections);
      }
      this.simulation.alpha(1);
      this.simulation.restart();
    }
  }

  public componentWillUnmount() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  // •  Influence (weakest)
  // •  Access
  // •  Serving
  // •  Realization
  // •  Assignment
  // •  Aggregation
  // •  Composition (strongest)
  private adjustLinkDistance = (d: Connection): number => {
    const rel = d.entityInstance();
    const relType = rel ? rel.type : "";
    const dist = (x: number) => (DEFAULT_DISTANCE * x) / 100;
    switch (relType) {
      case "Influence":
        return dist(200);
      case "Access":
        return dist(150);
      case "Serving":
        return dist(120);
      case "Realization":
        return dist(100);
      case "Assignment":
        return dist(80);
      case "Aggregation":
        return dist(60);
      case "Composition":
        return dist(50);
      default:
        return dist(100);
    }
  };

  /**
   * Called on each "tick" of the D3 Force simulation
   * Not to be called directly
   */
  private ticked = () => {
    if (this.simulation) {
      // this.simulation.force(
      //   "center",
      //   d3force.forceCenter(this.props.centerX, this.props.centerY),
      // );
      if (this.props.onForceLayoutTick) {
        this.props.onForceLayoutTick();
      }
    }
  };
}
