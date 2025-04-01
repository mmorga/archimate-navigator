import * as React from "react";
import { IEntity, IRelationship, Relationship } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import { Card, Table } from "react-bootstrap";

const RelationshipsTable = React.memo(
  ({
    relationships,
    entityClicked,
  }: {
    relationships: IRelationship[];
    entityClicked: entityClickedFunc;
  }) => {
    const relationshipRefLink = (refMaybe: IEntity | undefined) => {
      if (refMaybe === undefined) {
        return "";
      }
      const ref = refMaybe as IEntity;
      return (
        <EntityLink
          entity={ref}
          entityClicked={entityClicked}
          text={`${ref.name} (${ref.type})`}
        />
      );
    };

    const relationshipName = (rel: IRelationship): string => {
      if (rel.name && rel.name.length > 0) {
        return `${rel.name} (${rel.type})`;
      }
      return rel.type;
    };

    const relationshipsList = relationships ? relationships : [];
    let tableRows = null;
    if (relationshipsList.length === 0) {
      tableRows = [
        <tr key="no-relationships">
          <td colSpan={3}>No Relationships</td>
        </tr>,
      ];
    } else {
      tableRows = relationshipsList
        .filter((r) => r !== undefined)
        .filter((r) => r instanceof Relationship)
        .sort(byType)
        .map((relationship) => (
          <tr key={relationship.id}>
            <td>
              <EntityLink
                entity={relationship}
                entityClicked={entityClicked}
                text={relationshipName(relationship)}
              />
            </td>
            <td>{relationshipRefLink(relationship.sourceElement())}</td>
            <td>{relationshipRefLink(relationship.targetElement())}</td>
          </tr>
        ));
    }
    return (
      <Card>
        <Card.Title>Relationships</Card.Title>
        <Card.Body>
          <Table borderless={true} hover={true} size="sm" striped="columns">
            <thead>
              <tr key="relationships-header">
                <th>Relationship Type</th>
                <th>Source</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody id="element-relationships">{tableRows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  },
);

export function byType(a: IEntity, b: IEntity): number {
  if (a === b) {
    return 0;
  }

  return a.type.localeCompare(b.type);
}

export default RelationshipsTable;
