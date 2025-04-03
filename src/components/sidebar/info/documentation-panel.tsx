import "github-markdown-css/github-markdown.css";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "react-bootstrap";

const DocumentationPanel = memo(({ str }: { str: string | undefined }) => {
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
