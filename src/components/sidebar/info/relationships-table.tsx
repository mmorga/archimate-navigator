import * as React from "react";
import { IEntity, IRelationship, Relationship } from "../../../archimate-model";
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
      tableRows = relationships.filter(r => r !== undefined).filter(r => r instanceof Relationship).map(relationship => (
        <tr key={relationship.id}>
          <td>
            <EntityLink
              entity={relationship}
              entityClicked={this.props.entityClicked}
              text={this.relationshipName(relationship)}
            />
          </td>
          <td>
            {this.relationshipRefLink(relationship.sourceElement())}
          </td>
          <td>
            {this.relationshipRefLink(relationship.targetElement())}
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

  private relationshipRefLink(refMaybe: IEntity | undefined) {
    if (refMaybe === undefined) {
      return "";
    }
    const ref = refMaybe as IEntity;
    return (
      <EntityLink
        entity={ref}
        entityClicked={this.props.entityClicked}
        text={`${ref.name} (${ ref.type })`}
      />
    );
  }

  private relationshipName(rel: IRelationship): string {
    if (rel.name && rel.name.length > 0) {
      return `${rel.name} (${rel.type})`;
    }
    return rel.type;
  }
}