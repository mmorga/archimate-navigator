import * as React from "react";
import { Card, Table } from "react-bootstrap";
import "../archimate-navigator.css";

const ModelInfo = React.memo(function modelInfo({
  modelName,
  diagramName,
  diagramViewpoint,
}: {
  modelName: string | undefined;
  diagramName: string | undefined;
  diagramViewpoint: string | undefined;
}) {
  const diagramCol = () => {
    if (diagramName) {
      return (
        <td>
          <strong>{diagramName}</strong>{" "}
          <small>
            &lt;
            {diagramViewpoint}
            &nbsp;Viewpoint&gt;
          </small>
        </td>
      );
    }

    return <td>Not Selected</td>;
  };

  return (
    <Card body={true}>
      <Table borderless={true} hover={true} size="sm" striped="columns">
        <tbody>
          <tr>
            <td>
              <small>ArchiMate Model:</small>
            </td>
            <td>
              <strong>{modelName || "Unknown"}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <small>Diagram:</small>
            </td>
            {diagramCol()}
          </tr>
        </tbody>
      </Table>
    </Card>
  );
});

export default ModelInfo;
