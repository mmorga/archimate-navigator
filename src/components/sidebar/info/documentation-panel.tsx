import "github-markdown-css/github-markdown.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "react-bootstrap";

interface IProps {
  str?: string | undefined;
}

const DocumentationPanel: React.FC<IProps> = React.memo(({ str }) => {
  return (
    <Card>
      <Card.Title>Documentation</Card.Title>
      <Card.Body>
        <ReactMarkdown>{str || "No Documentation"}</ReactMarkdown>
      </Card.Body>
    </Card>
  );
});

export default DocumentationPanel;
