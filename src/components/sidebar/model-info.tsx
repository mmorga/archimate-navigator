import * as React from "react";
import { Col, Form } from "react-bootstrap";
import "../archimate-navigator.css";

interface IProps {
  modelName: string;
  diagramName: string | undefined;
  diagramViewpoint: string | undefined;
}

const ModelInfo: React.FC<IProps> = React.memo(
  ({ modelName, diagramName, diagramViewpoint }) => {
    const diagramRow = () => {
      if (diagramName) {
        return (
          <Form.Group>
            <Col sm={2}>
              <Form.Label className="text-muted">
                <small>Model</small>
              </Form.Label>
            </Col>
            <Col sm={10}>
              <Form.Text>
                <strong>{diagramName}</strong>{" "}
                <small>
                  &lt;
                  {diagramViewpoint}
                  &nbsp;Viewpoint&gt;
                </small>
              </Form.Text>
            </Col>
          </Form.Group>
        );
      }
      return null;
    };

    return (
      <Form>
        <Form.Group>
          <Col sm={2}>
            <Form.Label className="text-muted">
              <small>Model</small>
            </Form.Label>
          </Col>
          <Col sm={10}>
            <Form.Text>
              <strong>{modelName}</strong>
            </Form.Text>
          </Col>
        </Form.Group>
        {diagramRow()}
      </Form>
    );
  },
);

export default ModelInfo;
