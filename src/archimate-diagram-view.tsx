import * as React from "react";
import Diagram from "./diagram";
import Entity from "./entity";

interface IProps {
    selectedDiagram?: Diagram;
    selectedEntity?: Entity;
    entityClicked: (entity: Entity) => void;
    diagramClicked: (event: React.MouseEvent<Element>) => void;
}

interface IState {
    loadedDiagram?: Diagram;
    selectedEntity?: Entity;
    svg: void | Document;
    error?: any;
}

export default class ArchimateDiagramView extends React.PureComponent<IProps, IState> {
    public state: IState;

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedEntity: this.props.selectedEntity,
            svg: undefined,
        }
    }

    public render() {
        this.loadDiagram();
        if (this.state.svg) {
            return this.state.svg;
        } else {
            const svg = this.state.svg;
            return (
                <div className="jumbotron" id="archimate-splash-content">
                    Select a diagram on the left to view.
                    {svg ? (svg) : ("no svg")}
                </div>
            );
        }
    }

    public loadDiagram() {
        if ((this.props.selectedDiagram === undefined) || (this.props.selectedDiagram === this.state.loadedDiagram)) {
            return;
        }
        const selectedDiagram = this.props.selectedDiagram as Diagram;
        fetch(selectedDiagram.path)
            .then(res => res.text())
            .then(str => (new DOMParser()).parseFromString(str, "text/xml"),
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  this.setState({
                    error
                  });
                })
            .then(dom => {
                // eslint-disable-next-line no-console
                console.log("Got something!");
                this.setState({svg: dom[0]});
            })
    }
}
