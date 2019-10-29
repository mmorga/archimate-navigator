import * as React from "react";
import {
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup
} from "react-bootstrap";
import "../archimate-navigator.css";

interface IProps {
  modelName: string;
  diagramName: string | undefined;
  diagramViewpoint: string | undefined;
}

export default class ModelInfo extends React.Component<IProps> {
  public render() {
    return (
      <Form horizontal={true}>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            <small className="text-muted">Model</small>
          </Col>
          <Col sm={10}>
            <FormControl.Static>
              <strong>{this.props.modelName}</strong>
            </FormControl.Static>
          </Col>
        </FormGroup>
        {this.diagramRow()}
      </Form>
    );
  }

  protected diagramRow() {
    if (this.props.diagramName) {
      return (
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            <small className="text-muted">Diagram</small>
          </Col>
          <Col sm={10}>
            <FormControl.Static>
              <strong>{this.props.diagramName}</strong>{" "}
              <small>
                &lt;
                {this.props.diagramViewpoint}
                &nbsp;Viewpoint&gt;
              </small>
            </FormControl.Static>
          </Col>
        </FormGroup>
      );
    } else {
      return null;
    }
  }
}
