import { JSX, memo } from "react";
import {
  Diagram,
  Element,
  IEntity,
  Relationship,
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import { Card, Table } from "react-bootstrap";

const EntityIdPanel = memo(
  ({
    entity,
    entityClicked,
  }: {
    entity: IEntity | undefined;
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

    const diagramContent = (): JSX.Element => {
      const diagram = entity as Diagram;
      return (
        <tr key="entity-type">
          <th>Diagram Viewpoint</th>
          <td>{diagram.viewpointDescription()}</td>
        </tr>
      );
    };

    const relationshipContent = (): JSX.Element => {
      const relationship = entity as Relationship;
      return (
        <>
          <tr key="relationship-type">
            <th>Relationship</th>
            <td>{relationship.type}</td>
          </tr>
          <tr key="relationship-source">
            <th>Source</th>
            <td>{relationshipRefLink(relationship.sourceElement())}</td>
          </tr>
          <tr key="relationship-target">
            <th>Target</th>
            <td>{relationshipRefLink(relationship.targetElement())}</td>
          </tr>
        </>
      );
    };

    const elementContent = (): JSX.Element => {
      const element = entity as Element;
      return (
        <tr key="entity-type">
          <th>Element</th>
          <td>{element.type}</td>
        </tr>
      );
    };

    const entityContent = (): JSX.Element | JSX.Element[] => {
      if (entity instanceof Diagram) {
        return diagramContent();
      } else if (entity instanceof Relationship) {
        return relationshipContent();
      } else if (entity instanceof Element) {
        return elementContent();
      } else {
        return [];
      }
    };

    const name = entity ? (
      entity.name
    ) : (
      <span className="text-muted">Nothing Selected</span>
    );

    return (
      <Card>
        <Card.Body>
          <Table borderless={true} hover={true} size="sm" striped="columns">
            <tbody>
              <tr key="entity-name">
                <th>Name</th>
                <td>{name}</td>
              </tr>
              {entityContent()}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  },
);

export default EntityIdPanel;
