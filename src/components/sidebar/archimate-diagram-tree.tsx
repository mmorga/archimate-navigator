import * as React from "react";
import { Diagram, IEntity, Organization } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import EntityLink from "./entity-link";
import FolderItem from "./folder-item";

interface IProps {
  views: Organization;
  entityClicked: entityClickedFunc;
  selectedDiagram: Diagram | undefined;
}

export default class ArchimateDiagramTree extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    let folderChildren = [<li key="loading">Loading</li>];
    let itemChildren: JSX.Element[] = [];
    if (this.props.views) {
      folderChildren = this.props.views.organizations
          .sort(entitySortFunc)
          .map(organization => (
        <FolderItem
          key={organization.id}
          organization={organization}
          entityClicked={this.props.entityClicked}
        />
      ));
      itemChildren = this.props.views.itemEntities()
        .sort(entitySortFunc)
        .map(item => (
        <li key={item.id} className={this.selectedItemClass(item)}>
          <EntityLink entity={item} entityClicked={this.props.entityClicked} textClass={this.selectedItemClass(item)}>
            <span className="glyphicon glyphicon-picture" style={this.selectedItemIconStyle(item)}/>&nbsp;
          </EntityLink>
        </li>
      ));
    }
    return (
      <div className="panel panel-default">
        <div
          id="archimate-view-index"
          className="panel-body archimate-view-index"
        >
          <ul className="archimate-organization-list">
            {folderChildren}
            {itemChildren}
          </ul>
        </div>
      </div>
    );
  }

  private selectedItemIconStyle(item: IEntity): React.CSSProperties {
    if (this.props.selectedDiagram && this.props.selectedDiagram.id === item.id) {
      return {color: "white"};
    } else {
      return {};
    }
  }

  private selectedItemClass(item: IEntity): string {
    if (this.props.selectedDiagram && this.props.selectedDiagram.id === item.id) {
      return "bg-primary";
    } else {
      return "";
    }
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
