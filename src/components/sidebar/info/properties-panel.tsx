import * as React from "react";
import { Property } from "../../../archimate-model";
import Panel from "../panel";

interface IProps {
  properties: Property[];
}

export default class PropertiesPanel extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const properties = this.props.properties ? this.props.properties : [];
    let tableRows = null;
    if (properties.length === 0) {
      tableRows = [
        <tr key={undefined}>
          <td colSpan={2}>No Properties</td>
        </tr>
      ];
    } else {
      tableRows = properties.map(property => (
        <tr key={property.key}>
          <td>{property.key}</td>
          <td>{this.value(property.value)}</td>
        </tr>
      ));
    }

    return (
      <Panel header="Properties">
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody id="archimate-element-properties">{tableRows}</tbody>
        </table>
      </Panel>
    );
  }

  private value(v: string | undefined) {
    if (v) {
      return v;
    }

    return <i>undefined</i>;
  }
}
