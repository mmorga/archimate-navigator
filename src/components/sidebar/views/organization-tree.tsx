import * as React from "react";
import { useState } from "react";
import { IEntity, Organization } from "../../../archimate-model";
import "../../archimate-navigator.css";
import { entityClickedFunc } from "../../common";
import OrganizationContent from "./organization-content";

interface IProps {
  // model: Model;
  // organization: Organization;
  organizationName: string | undefined;
  organizationId: string;
  organizations: Organization[];
  items: IEntity[];
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

// TODO: save the open closed state to localStorage
// (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
const OrganizationTree: React.FC<IProps> = React.memo(({
  organizationName,
  organizationId,
  organizations,
  items,
  entityClicked,
  selectedEntity
}) => {
  const [collapse, setCollapse] = useState(true);

  const handleClick = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    setCollapse(!collapse);
  };

  const ulId = organizationId;
  const linkHref = `#${ulId}`;

  return (
    <li key={organizationId} id={organizationId}>
      <a
        className="archimate-folder text-muted"
        role="button"
        data-toggle="collapse"
        href={linkHref}
        onClick={handleClick}
      >
        <span
          className={
            collapse
              ? "glyphicon glyphicon-folder-close"
              : "glyphicon glyphicon-folder-open"
          }
        />
        &nbsp;
        {organizationName}
      </a>
      <ul
        id={ulId}
        className={
          collapse
            ? "archimate-organization-list collapse"
            : "archimate-organization-list"
        }
      >
        <OrganizationContent
          organizations={organizations}
          items={items}
          entityClicked={entityClicked}
          selectedEntity={selectedEntity}
        />
      </ul>
    </li>
  );
});

export default OrganizationTree;
