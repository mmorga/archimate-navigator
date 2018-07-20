import * as React from "react";
import { Organization } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import EntityLink from "./entity-link";

interface IProps {
  organization: Organization;
  entityClicked: entityClickedFunc;
}

interface IState {
  collapse: boolean;
}

// TODO: save the open closed state to localStorage
// (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
export default class FolderItem extends React.PureComponent<IProps, IState> {
  public state: IState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  public render() {
    const collapsed: any = { className: null };
    let icon = "glyphicon glyphicon-folder-close";
    if (this.state.collapse) {
      collapsed.className = "collapse";
      icon = "glyphicon glyphicon-folder-open";
    }
    const folderChildren: any = this.props.organization.organizations.map(
      org => (
        <FolderItem
          key={org.id}
          organization={org}
          entityClicked={this.props.entityClicked}
        />
      )
    );
    const diagramChildren = this.props.organization.itemEntities().map(item => (
      <li key={item.id}>
        <EntityLink entity={item} entityClicked={this.props.entityClicked} />
      </li>
    ));
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
          <span className={icon} /> {this.props.organization.name}
        </a>
        <ul id={ulId} {...collapsed}>
          {folderChildren}
          {diagramChildren}
        </ul>
      </li>
    );
  }

  private handleClick = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    this.setState({ collapse: !this.state.collapse });
  };
}
