import * as React from "react";
import { Diagram } from "../archimate-model";
import Svg from "./svg";

export enum ActiveView {
  Diagram = 1,
  Graph,
  Table
}

interface IProps {
  name?: string;
  viewpoint: string;
  viewKey: ActiveView;
  viewSelected: (view: ActiveView) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomFull: () => void;
  selectedDiagram?: Diagram;
  selectedSvg?: Svg;
  diagramZoom: number;
}

export default class ArchimateHeader extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const navbarMargin = {
      marginBottom: "0",
      marginLeft: "-0.5em",
      marginRight: "-0.5em",
      marginTop: "-0.5em"
    };
    return (
      <nav className="navbar navbar-default" style={navbarMargin}>
        <div className="container-fluid">
          <div
            className="navbar-header col-md-4"
            style={{ overflow: "hidden" }}
          >
            <a
              id="archimate-diagram-title"
              className="navbar-brand archimate-diagram-header"
              href="#"
            >
              {this.props.name} &nbsp;
              <small>{this.props.viewpoint}</small>
            </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul
              className="nav nav-tabs"
              style={{ display: "inline-block", marginTop: "3px" }}
            >
              <li
                role="presentation"
                className={
                  this.props.viewKey === ActiveView.Diagram
                    ? "active"
                    : undefined
                }
              >
                <a onClick={this.diagramSelected}>Diagram</a>
              </li>
              <li
                role="presentation"
                className={
                  this.props.viewKey === ActiveView.Graph ? "active" : undefined
                }
              >
                <a onClick={this.graphSelected}>Graph</a>
              </li>
              <li
                role="presentation"
                className={
                  this.props.viewKey === ActiveView.Table ? "active" : undefined
                }
              >
                <a onClick={this.tableSelected}>Table</a>
              </li>
            </ul>
            <div
              className="btn-group navbar-right"
              role="group"
              aria-label="Diagram Controls"
            >
              {this.props.diagramZoom}%
              <button
                className="btn btn-default btn-sm navbar-btn"
                onClick={this.zoomIn}
                disabled={!this.props.selectedDiagram}
              >
                <span className="glyphicon glyphicon-zoom-in" />
              </button>
              <button
                className="btn btn-default btn-sm navbar-btn"
                onClick={this.zoomOut}
                disabled={!this.props.selectedDiagram}
              >
                <span className="glyphicon glyphicon-zoom-out" />
              </button>
              <button
                className="btn btn-default btn-sm navbar-btn"
                onClick={this.zoomFull}
                disabled={!this.props.selectedDiagram}
              >
                <span className="glyphicon glyphicon-fullscreen" />
              </button>
              {this.diagramInNewWindow()}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  private diagramSelected = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    this.handleSelect(ActiveView.Diagram);
  };

  private graphSelected = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    this.handleSelect(ActiveView.Graph);
  };

  private tableSelected = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    this.handleSelect(ActiveView.Table);
  };

  private handleSelect = (key: ActiveView) => {
    if (this.props.viewSelected) {
      this.props.viewSelected(key);
    }
  };

  private zoomIn = () => {
    if (this.props.zoomIn) {
      this.props.zoomIn();
    }
  };

  private zoomOut = () => {
    if (this.props.zoomOut) {
      this.props.zoomOut();
    }
  };

  private zoomFull = () => {
    if (this.props.zoomFull) {
      this.props.zoomFull();
    }
  };

  private openInNewWindow = () => {
    if (this.props.selectedDiagram) {
      window.open(
        this.props.selectedDiagram.path,
        "_blank",
        "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"
      );
    }
  };

  private diagramInNewWindow() {
    if (this.props.viewKey === ActiveView.Diagram) {
      return (
        <button
          className="btn btn-default btn-sm navbar-btn"
          onClick={this.openInNewWindow}
          disabled={!this.props.selectedDiagram}
        >
          <span className="glyphicon glyphicon-new-window" />
        </button>
      );
    }
    return null;
  }
}
