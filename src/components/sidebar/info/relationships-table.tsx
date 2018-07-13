import * as React from "react";
import { IEntity, IRelationship } from "../../../archimate-model";
import EntityLink from "../entity-link";
import Panel from "../panel";

interface IProps {
  relationships: IRelationship[];
  entityClicked: (entity: IEntity) => void;
}

export default class RelationshipsTable extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const relationships = this.props.relationships
      ? this.props.relationships
      : [];
    let tableRows = null;
    if (relationships.length === 0) {
      tableRows = [
        <tr key="no-relationships">
          <td colSpan={3}>No Relationships</td>
        </tr>
      ];
    } else {
      tableRows = relationships.map(relationship => (
        <tr key={relationship.id}>
          <td>
            <EntityLink
              entity={relationship}
              entityClicked={this.props.entityClicked}
              text={this.relationshipName(relationship)}
            />
          </td>
          <td>
            <EntityLink
              entity={relationship.sourceElement()}
              entityClicked={this.props.entityClicked}
              text={`${relationship.sourceElement()!.name} (${
                relationship.sourceElement()!.type
              })`}
            />
          </td>
          <td>
            <EntityLink
              entity={relationship.targetElement()}
              entityClicked={this.props.entityClicked}
              text={`${relationship.targetElement()!.name} (${
                relationship.targetElement()!.type
              })`}
            />
          </td>
        </tr>
      ));
    }

    return (
      <Panel header="Relationships">
        <table className="table">
          <thead>
            <tr key="relationships-header">
              <th>Relationship Type</th>
              <th>Source</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody id="archimate-element-relationships">{tableRows}</tbody>
        </table>
      </Panel>
    );
  }

  private relationshipName(rel: IRelationship): string {
    if (rel.name && rel.name.length > 0) {
      return `${rel.name} (${rel.type})`;
    }
    return rel.type;
  }
}
