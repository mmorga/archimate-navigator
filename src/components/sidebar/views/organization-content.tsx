import { isEqual } from "lodash-es";
import memoizeOne from 'memoize-one';
import * as React from "react";
import { IEntity, Organization } from "../../../archimate-model";
import "../../archimate-navigator.css";
import { entityClickedFunc } from "../../common";
import OrganizationItem from "./organization-item";
import OrganizationTree from "./organization-tree";

interface IProps {
  // model: Model;
  // organization: Organization;
  organizations: Organization[];
  items: IEntity[];
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

interface IState {
  itemEntities: string[];
}

// Displays the list of organizations and entities that belong to the given organization
export default class OrganizationContent extends React.Component<
  IProps,
  IState
> {
  public static getDerivedStateFromProps(
    props: Readonly<IProps>,
    state: Readonly<IState>
  ): IState | null {
    const itemEntities = props.items.map(i => i.id);
    if (state && isEqual(itemEntities, state.itemEntities)) {
      return null;
    } else {
      return { itemEntities };
    }
  }

  private sortedOrganizations = memoizeOne<
    (organizations: Organization[]) => Organization[]
  >(organizations => organizations.sort(entitySortFunc));

  // private sortedItems = memoize<(items: string[]) => IEntity[]>(
  //   items => items
  //       .map(id => this.props.model.lookup(id))
  //       .filter(e => e !== undefined)
  //       .map(e => e as IEntity)
  //       .sort(entitySortFunc)
  // );

  constructor(props: IProps) {
    super(props);
    this.state = {
      itemEntities: []
    };
  }

  public shouldComponentUpdate(
    nextProps: Readonly<IProps>,
    nextState: Readonly<IState>
  ): boolean {
    if (
      this.props.organizations !== nextProps.organizations ||
      this.props.items !== nextProps.items ||
      this.props.selectedEntity !== nextProps.selectedEntity
    ) {
      return true;
    }

    if (this.state.itemEntities.length !== nextState.itemEntities.length) {
      return true;
    }

    return !isEqual(this.state.itemEntities, nextState.itemEntities);
  }

  // public componentDidUpdate(prevProps: IProps) {
  // }

  public render() {
    return (
      <ul className="archimate-organization-list">
        {this.sortedOrganizations(this.props.organizations).map(
          organization => (
            <OrganizationTree
              key={organization.id}
              organizationName={organization.name}
              organizationId={organization.id}
              organizations={organization.organizations}
              items={organization.itemEntities()}
              entityClicked={this.props.entityClicked}
              selectedEntity={this.props.selectedEntity}
            />
          )
        )}
        {this.props.items.sort(entitySortFunc).map(entity => (
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
