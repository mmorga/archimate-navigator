import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../archimate-navigator.css";

interface IProps {
  modelName: string;
  diagramName: string | undefined;
  diagramViewpoint: string | undefined;
}

const ModelInfo: React.FC<IProps> = React.memo(
  ({ modelName, diagramName, diagramViewpoint }) => {
    const diagramCol = () => {
      if (diagramName) {
        return (
          <Col>
            <strong>{diagramName}</strong>{" "}
            <small>
              &lt;
              {diagramViewpoint}
              &nbsp;Viewpoint&gt;
            </small>
          </Col>
        );
      }

      return <Col>Not Selected</Col>;
    };

    return (
      <Container>
        <Row>
          <Col>
            <small>ArchiMate Model:</small>
          </Col>
          <Col>
            <strong>{modelName || "Unknown"}</strong>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>Diagram:</small>
          </Col>
          {diagramCol()}
        </Row>
      </Container>
    );
  },
);

export default ModelInfo;
