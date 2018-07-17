import * as React from "react";
import { Diagram, IEntity } from "../../archimate-model";
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
    // This binding is necessary to make `this` work in the callback
    // this.myOnLoadHandler = this.myOnLoadHandler.bind(this);
  }

  public render() {
    if (this.props.selectedDiagram) {
      const selectedDiagram = this.props.selectedDiagram as Diagram;
      return (
        <ArchimateSvg title={this.props.selectedDiagram.name} desc={this.props.selectedDiagram.documentation} viewBox={this.props.selectedDiagram.calculateMaxExtents()}>
            { selectedDiagram.nodes.map(node => (<ArchimateViewNode key={node.id} viewNode={node} />)) }
        </ArchimateSvg>
      );
    } else {
      // const svg = this.state.svg;
      return (
        <div className="jumbotron" id="archimate-splash-content">
          Select a diagram on the left to view.
        </div>
      );
    }
  }

  // public myOnLoadHandler(src?: string | React.SyntheticEvent<SVG>, cached?: boolean) {
  //     this.setState({
  //         isCached: cached || false,
  //         loadedSrc: (src as string) || "No source",
  //     });
  // }

  // public loadDiagram() {
  //     if ((this.props.selectedDiagram === undefined) || (this.props.selectedDiagram === this.state.loadedDiagram)) {
  //         return;
  //     }
  //     const selectedDiagram = this.props.selectedDiagram as Diagram;
  //     fetch(selectedDiagram.path)
  //         .then(res => res.text())
  //         .then(str => (new DOMParser()).parseFromString(str, "text/xml"),
  //             // Note: it's important to handle errors here
  //             // instead of a catch() block so that we don't swallow
  //             // exceptions from actual bugs in components.
  //             (error) => {
  //               this.setState({
  //                 error
  //               });
  //             })
  //         .then(dom => {
  //             // eslint-disable-next-line no-console
  //             console.log("Got something!");
  //             this.setState({svg: dom[0]});
  //         })
  // }
}
