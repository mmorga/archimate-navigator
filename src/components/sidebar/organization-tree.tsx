import * as React from "react";
import { IEntity, Organization } from "../../archimate-model";
import "../archimate-navigator.css";
import { entityClickedFunc } from "../common";
import OrganizationContent from "./organization-content";

interface IProps {
  organization: Organization;
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

interface IState {
  collapse: boolean;
}

// TODO: save the open closed state to localStorage
// (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
export default class OrganizationTree extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  public render(): JSX.Element {
    const ulId = `${this.props.organization.id}`;
    const linkHref = `#${ulId}`;
    return (
      <li key={this.props.organization.id} id={this.props.organization.id}>
        <a
          className="archimate-folder text-muted"
          role="button"
          data-toggle="collapse"
          href={linkHref}
          onClick={this.handleClick}
        >
          <span className={this.state.collapse ? "glyphicon glyphicon-folder-close" : "glyphicon glyphicon-folder-open"} />
          &nbsp;{this.props.organization.name}
        </a>
        <ul id={ulId} className={this.state.collapse ? "archimate-organization-list collapse" : "archimate-organization-list"}>
          <OrganizationContent 
            organization={this.props.organization}
            entityClicked={this.props.entityClicked}
            selectedEntity={this.props.selectedEntity}
          />
        </ul>
      </li>
    );
  }

  private handleClick = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    this.setState({ collapse: !this.state.collapse });
  };
}
