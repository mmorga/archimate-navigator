import "github-markdown-css/github-markdown.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import Panel from "../panel";

interface IProps {
  str: string | undefined;
  header?: string;
}

export default class DocumentationPanel extends React.PureComponent<IProps> {
  public render() {
    const hasContent = this.props.str && this.props.str.trim().length > 0;
    const title = this.props.header || "Documentation";
    const header = hasContent ? (
      title
    ) : (
      <>
        {title} <span className="small">(none)</span>
      </>
    );
    return (
      <Panel header={header} initiallyCollapsed={!hasContent}>
        <ReactMarkdown>
          {this.props.str || "No Documentation"}
        </ReactMarkdown>
      </Panel>
    );
  }
}
