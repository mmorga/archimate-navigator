import * as React from "react";
import { Diagram, IEntity, IEntityRef } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ArchimateConnection from "./archimate-connection";
import ArchimateSvg from "./archimate-svg";
import ArchimateViewNode from "./archimate-view-node";

interface IProps {
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  entityClicked: entityClickedFunc;
  diagramClicked: entityClickedFunc;
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
            <ArchimateViewNode
              key={node.id} 
              viewNode={node} 
              onClicked={this.props.entityClicked} 
              selected={this.nodeIsSelected(node)}
            />
          ))}
          {selectedDiagram.connections.map(conn => (
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
