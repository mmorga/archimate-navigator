import * as React from "react";
import { Col, ControlLabel, Form, FormControl, FormGroup } from "react-bootstrap";
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
      <Form horizontal={true}>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}><small className="text-muted">Model</small></Col>
          <Col sm={10}>
            <FormControl.Static><strong>{this.props.model.name}</strong></FormControl.Static>
          </Col>
        </FormGroup>
        {this.diagramRow()}
      </Form>
    );
  }

  protected diagramRow() {
    if (this.props.selectedDiagram) {
      return (
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}><small className="text-muted">Diagram</small></Col>
          <Col sm={10}>
            <FormControl.Static>
              <strong>{this.props.selectedDiagram.name}</strong> {" "}
              <small>&lt;{this.props.selectedDiagram.viewpointDescription()}&nbsp;Viewpoint&gt;</small>
            </FormControl.Static>
          </Col>
        </FormGroup>
      );
    } else {
      return null;
    }
  }
}
