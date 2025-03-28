import * as React from "react";
import { Element } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import { Card } from "react-bootstrap";

interface IProps {
  elements: Element[];
  elementClicked: entityClickedFunc;
}

const ElementsTable: React.FC<IProps> = React.memo(
  ({ elements, elementClicked }) => {
    let elementRows = [
      <tr key="no-elements">
        <td colSpan={4}>
          <p className="text-info">No elements</p>
        </td>
      </tr>,
    ];

    if (elements.length > 0) {
      elementRows = elements.sort(byTypeAndName).map((element) => {
        return (
          <tr key={element.id}>
            <td>
              <EntityLink entity={element} entityClicked={elementClicked} />
            </td>
            <td>{element.type}</td>
          </tr>
        );
      });
    }
    return (
      <Card>
        <Card.Title>Elements</Card.Title>
        <Card.Body>
          <table className="table archimate-elements-table">
            <thead>
              <tr key="elements-header">
                <th>Element</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>{elementRows}</tbody>
          </table>
        </Card.Body>
      </Card>
    );
  },
);

export function byTypeAndName(a: Element, b: Element): number {
  if (a === b) {
    return 0;
  }

  if (a.type !== b.type) {
    return a.type.localeCompare(b.type);
  } else {
    return a.name.localeCompare(b.name);
  }
}

export default ElementsTable;
