import "github-markdown-css/github-markdown.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import Panel from "./sidebar/panel";

interface IProps {
  str: string | undefined;
  header?: string;
}

export default class DocumentationPanel extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const hasContent = (this.props.str && (this.props.str.trim().length > 0));
    const title = this.props.header || "Documentation";
    const header = hasContent ? title : (<React.Fragment>{title} <span className="small">(none)</span></React.Fragment>);
    return (
      <Panel 
          header={header}
          initiallyCollapsed={!hasContent}>
        <ReactMarkdown className="markdown-body" source={this.props.str || "No Documentation"} />
      </Panel>
    )
  }
}
