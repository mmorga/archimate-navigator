import * as React from "react";
import { IEntity, Organization } from "../../archimate-model";
import "../archimate-navigator.css";
import { entityClickedFunc } from "../common";
import OrganizationItem from "./organization-item";
import OrganizationTree from "./organization-tree";

interface IProps {
  organization: Organization;
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

// Displays the list of organizations and entities that belong to the given organization
export default class OrganizationContent extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <ul className="archimate-organization-list">
        {this.props.organization.organizations.sort(entitySortFunc).map(organization => (
          <OrganizationTree
            key={organization.id}
            organization={organization}
            entityClicked={this.props.entityClicked}
            selectedEntity={this.props.selectedEntity}
          />
        ))}
        {this.props.organization.itemEntities().sort(entitySortFunc).map(entity => (
          <OrganizationItem
            key={entity.id}
            entity={entity}
            entityClicked={this.props.entityClicked}
            selectedEntity={this.props.selectedEntity}
          />
        ))}
      </ul>
    );
  }
}

function entitySortFunc(a: IEntity, b: IEntity): number {
  if (a.name === undefined && b.name === undefined) {
    return 0;
  } else if (a.name === undefined) {
    return -1;
  } else if (b.name === undefined) {
    return 1;
  }

  const nameA = a.name;
  const nameB = b.name;
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}
