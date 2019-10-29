import * as React from "react";
import {
  Diagram,
  Element,
  IEntity,
  Relationship
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";

interface IProps {
  entity: IEntity;
  resultClicked: entityClickedFunc;
}

export default class SearchResult extends React.PureComponent<IProps> {
  public render() {
    return (
      <li>
        <EntityLink
          entity={this.props.entity}
          entityClicked={this.props.resultClicked}
          text={`${this.props.entity.name} (${this.entityType()})`}
        />
      </li>
    );
  }

  private entityType(): string {
    const entity = this.props.entity;
    let entityType = entity.type;
    if (entity instanceof Element) {
      entityType = entity.type || entityType;
    } else if (entity instanceof Relationship) {
      entityType = entity.type || entityType;
    } else if (entity instanceof Diagram) {
      entityType = entity.viewpoint || "Total";
    }
    return entityType;
  }
}
