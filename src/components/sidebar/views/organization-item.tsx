import * as React from "react";
import { IEntity } from "../../../archimate-model";
import "../../archimate-navigator.css";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";

interface IProps {
  entity: IEntity;
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

// Displays the list of organizations and entities that belong to the given organization
export default class OrganizationItem extends React.PureComponent<IProps> {
  public render() {
    return (
      <li
        key={this.props.entity.id}
        className={this.selectedItemClass(this.props.entity)}
      >
        <EntityLink
          entity={this.props.entity}
          entityClicked={this.props.entityClicked}
          textClass={this.selectedItemClass(this.props.entity)}
        >
          <span
            className="glyphicon glyphicon-picture"
            style={this.selectedItemIconStyle(this.props.entity)}
          />
          &nbsp;
        </EntityLink>
      </li>
    );
  }

  private selectedItemIconStyle(item: IEntity): React.CSSProperties {
    if (this.props.selectedEntity && this.props.selectedEntity.id === item.id) {
      return { color: "white" };
    } else {
      return {};
    }
  }

  private selectedItemClass(item: IEntity): string {
    if (this.props.selectedEntity && this.props.selectedEntity.id === item.id) {
      return "bg-primary";
    } else {
      return "";
    }
  }
}
