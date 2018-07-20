import * as React from "react";
import { Diagram, IEntity } from "../../archimate-model";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import ArchimateViewNode from "./archimate-view-node";

interface IProps {
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  entityClicked: (entity: IEntity) => void;
  diagramClicked: (event: React.MouseEvent<Element>) => void;
}

interface IState {
  loadedDiagram?: Diagram;
  selectedEntity?: IEntity;
  svg: void | Document;
  error?: any;
  loadedSrc?: string;
  isCached?: boolean;
}

export default class ArchimateDiagramView extends React.PureComponent<
  IProps,
  IState
> {
  public state: IState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isCached: false,
      selectedEntity: this.props.selectedEntity,
      svg: undefined
    };
  }

  public render() {
    if (this.props.selectedDiagram) {
      const selectedDiagram = this.props.selectedDiagram as Diagram;
      return (
        <ArchimateSvg
          key={this.props.selectedDiagram.id}
          diagram={this.props.selectedDiagram}
        >
          {selectedDiagram.nodes.map(node => (
            <ArchimateViewNode key={node.id} viewNode={node} />
          ))}
          {selectedDiagram.connections.map(conn => (
            <ArchimateConnection key={conn.id} connection={conn} />
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
}
