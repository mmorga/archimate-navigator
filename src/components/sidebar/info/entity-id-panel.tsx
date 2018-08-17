import * as React from "react";
import {
  Diagram,
  Element,
  IEntity,
  Relationship
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import Panel from "../panel";

interface IProps {
  entity: IEntity | undefined;
  entityClicked: entityClickedFunc;
}

export default class EntityIdPanel extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const entity = this.props.entity;
    const name = entity ? (
      entity.name
    ) : (
      <span className="text-muted">Nothing Selected</span>
    );
    return (
      <Panel>
        <table className="table">
          <tbody>
            <tr key="entity-name">
              <th>Name</th>
              <td>{name}</td>
            </tr>
            {this.entityContent()}
          </tbody>
        </table>
      </Panel>
    );
  }

  private entityContent(): React.ReactFragment {
    const entity = this.props.entity;
    if (entity instanceof Diagram) {
      return this.diagramContent();
    } else if (entity instanceof Relationship) {
      return this.relationshipContent();
    } else if (entity instanceof Element) {
      return this.elementContent();
    } else {
      return [];
    }
  }

  private diagramContent(): React.ReactFragment {
    const diagram = this.props.entity as Diagram;
    return (
      <tr key="entity-type">
        <th>Diagram Viewpoint</th>
        <td>{diagram.viewpointDescription()}</td>
      </tr>
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
        text={`${ref.name} (${ref.type})`}
      />
    );
  }

  private relationshipContent(): React.ReactFragment {
    const relationship = this.props.entity as Relationship;
    return (
      <>
        <tr key="relationship-type">
          <th>Relationship</th>
          <td>{relationship.type}</td>
        </tr>
        <tr key="relationship-source">
          <th>Source</th>
          <td>{this.relationshipRefLink(relationship.sourceElement())}</td>
        </tr>
        <tr key="relationship-target">
          <th>Target</th>
          <td>{this.relationshipRefLink(relationship.targetElement())}</td>
        </tr>
      </>
    );
  }

  private elementContent(): React.ReactFragment {
    const entity = this.props.entity as Element;
    return (
      <tr key="entity-type">
        <th>Element</th>
        <td>{entity.type}</td>
      </tr>
    );
  }
}
