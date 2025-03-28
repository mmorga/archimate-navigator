import "github-markdown-css/github-markdown.css";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Property } from "../../../archimate-model";
import { byOptionalString } from "./views-table";
import { Card } from "react-bootstrap";

interface IProps {
  properties: Property[];
}

const PropertiesPanel: React.FC<IProps> = React.memo(({ properties }) => {
  const value = (v: string | undefined) => {
    if (v) {
      return <ReactMarkdown>{v}</ReactMarkdown>;
    }
    return <i>undefined</i>;
  };

  const propertiesList = properties ? properties : [];
  let tableRows = null;
  if (propertiesList.length === 0) {
    tableRows = [
      <tr key={"no-properties"}>
        <td colSpan={2}>No Properties</td>
      </tr>,
    ];
  } else {
    tableRows = propertiesList.sort(byKeyAndValue).map((property) => (
      <tr key={property.key}>
        <td>{property.key}</td>
        <td>{value(property.value)}</td>
      </tr>
    ));
  }

  return (
    <Card>
      <Card.Title>Properties</Card.Title>
      <Card.Body>
        <table className="table">
          <thead>
            <tr key="properties-header">
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody id="element-properties">{tableRows}</tbody>
        </table>
      </Card.Body>
    </Card>
  );
});

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

export default PropertiesPanel;
