import { isEqual } from "lodash-es";
import memoizeOne from "memoize-one";
import { memo, useMemo, useState, useEffect } from "react";
import { IEntity, Organization } from "../../../archimate-model";
import "../../archimate-navigator.css";
import { entityClickedFunc } from "../../common";
import OrganizationItem from "./organization-item";
import OrganizationTree from "./organization-tree";

type IProps = {
  // model: Model;
  // organization: Organization;
  organizations: Organization[];
  items: IEntity[];
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
};

// Displays the list of organizations and entities that belong to the given organization
const OrganizationContent = memo(
  ({ organizations, items, entityClicked, selectedEntity }: IProps) => {
    const [itemEntities, setItemEntities] = useState<string[]>([]);

    // Replicate getDerivedStateFromProps using useEffect
    useEffect(() => {
      const newItemEntities = items.map((i) => i.id);
      if (!isEqual(newItemEntities, itemEntities)) {
        setItemEntities(newItemEntities);
      }
    }, [itemEntities, items]);

    // Memoize sorted organizations
    const sortedOrganizations = useMemo(() => {
      const memoizedSort = memoizeOne<
        (organizations: Organization[]) => Organization[]
      >((orgs) => orgs.sort(entitySortFunc));
      return memoizedSort(organizations);
    }, [organizations]);

    // Memoize sorted items
    const sortedItems = useMemo(() => {
      return items.sort(entitySortFunc);
    }, [items]);

    return (
      <ul className="archimate-organization-list">
        {sortedOrganizations.map((organization) => (
          <OrganizationTree
            key={organization.id}
            organizationName={organization.name}
            organizationId={organization.id}
            organizations={organization.organizations}
            items={organization.itemEntities()}
            entityClicked={entityClicked}
            selectedEntity={selectedEntity}
          />
        ))}
        {sortedItems.map((entity) => (
          <OrganizationItem
            key={entity.id}
            entity={entity}
            entityClicked={entityClicked}
            selectedEntity={selectedEntity}
          />
        ))}
      </ul>
    );
  },
  // Custom comparison function to replicate shouldComponentUpdate
  (prevProps, nextProps) => {
    if (
      prevProps.organizations !== nextProps.organizations ||
      prevProps.items !== nextProps.items ||
      prevProps.selectedEntity !== nextProps.selectedEntity
    ) {
      return false;
    }
    return true;
  },
);

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

export default OrganizationContent;
