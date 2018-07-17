import * as React from "react";
import {
  Diagram,
  Element,
  IEntity,
  Relationship
} from "../../../archimate-model";
import Panel from "../panel";

interface IProps {
  entity: IEntity | undefined;
}

export default class EntityIdPanel extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const entity = this.props.entity;
    const diagramRow =
      entity instanceof Diagram ? (
        <tr key="viewpoint">
          <th>Viewpoint</th>
          <td>{entity.viewpoint}</td>
        </tr>
      ) : undefined;
    const relationshipRow =
      entity instanceof Relationship ? (
        <tr key="relationship-type">
          <th>Relationship Type</th>
          <td>{entity.type}</td>
        </tr>
      ) : undefined;
    const elementRow =
      entity instanceof Element ? (
        <tr key="element-type">
          <th>Element Type</th>
          <td>{(entity as Element).type}</td>
        </tr>
      ) : undefined;
    const undefinedRow = entity === undefined ? (<tr><td>Nothing Selected</td></tr>) : undefined;
    const name = entity ? entity.name : undefined;
    const entityType = entity ? entity.type : undefined;
    return (
      <Panel>
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{entityType}</td>
            </tr>
            {diagramRow}
            {relationshipRow}
            {elementRow}
            {undefinedRow}
          </tbody>
        </table>
      </Panel>
    );
  }
}
