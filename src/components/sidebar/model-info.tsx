import * as React from "react";
import { Col, Form } from "react-bootstrap";
import "../archimate-navigator.css";

interface IProps {
  modelName: string;
  diagramName: string | undefined;
  diagramViewpoint: string | undefined;
}

export default class ModelInfo extends React.Component<IProps> {
  public render() {
    return (
      <Form>
        <Form.Group>
          <Col sm={2}>
            <Form.Label className="text-muted"><small>Model</small></Form.Label>
          </Col>
          <Col sm={10}>
            <Form.Text>
              <strong>{this.props.modelName}</strong>
            </Form.Text>
          </Col>
        </Form.Group>
        {this.diagramRow()}
      </Form>
    );
  }

  protected diagramRow() {
    if (this.props.diagramName) {
      return (
        <Form.Group>
          <Col sm={2}>
            <Form.Label className="text-muted"><small>Diagram</small></Form.Label>
          </Col>
          <Col sm={10}>
            <Form.Text>
              <strong>{this.props.diagramName}</strong>{" "}
              <small>
                &lt;
                {this.props.diagramViewpoint}
                &nbsp;Viewpoint&gt;
              </small>
            </Form.Text>
          </Col>
        </Form.Group>
      );
    } else {
      return null;
    }
  }
}
