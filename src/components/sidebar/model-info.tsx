import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Diagram, Model } from "../../archimate-model";
import "../archimate-navigator.css";

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
}

export default class ModelInfo extends React.Component<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <div className="row">
          <label className="col-sm-3">Model</label>
          <p className="col-sm-9"><strong>{this.props.model.name}</strong></p>
        </div>
        {this.documentationRow()}
        {this.diagramRow()}
      </React.Fragment>
    );
  }

  protected diagramRow() {
    if (this.props.selectedDiagram) {
      return (
        <div className="row">
          <label className="col-sm-3">Diagram</label>
          <p className="col-sm-9">
            <strong>{this.props.selectedDiagram.name}</strong> <small>&lt;{this.props.selectedDiagram.viewpointDescription()}&nbsp;Viewpoint&gt;</small>
          </p>
        </div>
      );
    } else {
      return null;
    }
  }

  protected documentationRow() {
    if (this.props.model.documentation && (this.props.model.documentation.trim().length > 0)) {
      return (
        <React.Fragment>
          <div className="row">
            <label>Documentation</label>
          </div>
          <div className="row">
            <div className="well archimate-documentation-well">
              <ReactMarkdown source={this.props.model.documentation} />
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}
