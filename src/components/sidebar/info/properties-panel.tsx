import "github-markdown-css/github-markdown.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Property } from "../../../archimate-model";
import Panel from "../panel";
import { byOptionalString } from "./views-table";

interface IProps {
  properties: Property[];
}

export default class PropertiesPanel extends React.PureComponent<IProps> {
  public render() {
    const properties = this.props.properties ? this.props.properties : [];
    let tableRows = null;
    if (properties.length === 0) {
      tableRows = [
        <tr key={"no-properties"}>
          <td colSpan={2}>No Properties</td>
        </tr>,
      ];
    } else {
      tableRows = properties.sort(byKeyAndValue).map((property) => (
        <tr key={property.key}>
          <td>{property.key}</td>
          <td>{this.value(property.value)}</td>
        </tr>
      ));
    }

    const propertiesEmpty = this.props.properties.length === 0;
    const header = !propertiesEmpty ? (
      "Properties"
    ) : (
      <>
        Properties <span className="small">(none)</span>
      </>
    );
    return (
      <Panel header={header} initiallyCollapsed={propertiesEmpty}>
        <table className="table">
          <thead>
            <tr key="properties-header">
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody id="element-properties">{tableRows}</tbody>
        </table>
      </Panel>
    );
  }

  private value(v: string | undefined) {
    if (v) {
      return <ReactMarkdown>{v}</ReactMarkdown>;
    }

    return <i>undefined</i>;
  }
}

export function byKeyAndValue(a: Property, b: Property): number {
  if (a === b) {
    return 0;
  }

  if (a.key !== b.key) {
    return a.key.localeCompare(b.key);
  } else {
    return byOptionalString(a.value, b.value);
  }
}
