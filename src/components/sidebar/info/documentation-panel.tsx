import { Card } from "react-bootstrap";
import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DocumentationPanel = memo(({ str }: { str: string | undefined }) => {
  return (
    <Card>
      <Card.Title>Documentation</Card.Title>
      <Card.Body>
        <Markdown remarkPlugins={[remarkGfm]}>
          {str || "No Documentation"}
        </Markdown>
      </Card.Body>
    </Card>
  );
});

export default DocumentationPanel;
