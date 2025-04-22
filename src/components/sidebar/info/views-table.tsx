import { memo } from "react";
import { IDiagram, IEntity } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import { Card, Table } from "react-bootstrap";

const ViewsTable = memo(
  ({
    views,
    entityClicked,
  }: {
    views: IDiagram[];
    entityClicked: entityClickedFunc;
  }) => {
    const viewsList = views ? views : [];
    let tableRows = null;
    if (viewsList.length === 0) {
      tableRows = [
        <tr key={"views-table-no-views"}>
          <td colSpan={2}>No Views</td>
        </tr>,
      ];
    } else {
      tableRows = viewsList.sort(byName).map((view) => (
        <tr key={view.path}>
          <td>
            <EntityLink entity={view} entityClicked={entityClicked} />
          </td>
          <td>{view.viewpoint}</td>
        </tr>
      ));
    }

    return (
      <Card>
        <Card.Title>Views</Card.Title>
        <Card.Body>
          <Table borderless={true} hover={true} size="sm" striped="columns">
            <thead>
              <tr key="views-table-header">
                <th>View</th>
                <th>Viewpoint</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  },
);

function byName(a: IEntity, b: IEntity): number {
  if (a === b) {
    return 0;
  }
  return byOptionalString(a.name, b.name);
}

export function byOptionalString(
  a: string | undefined,
  b: string | undefined,
): number {
  if (a === b) {
    return 0;
  }
  if (a === undefined) {
    if (b === undefined) {
      return 0;
    } else {
      return -1;
    }
  } else {
    if (b === undefined) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  }
}

export default ViewsTable;
