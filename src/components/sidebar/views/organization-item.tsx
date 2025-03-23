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
const OrganizationItem: React.FC<IProps> = React.memo(
  ({ entity, entityClicked, selectedEntity }) => {
    const selectedItemIconStyle = (item: IEntity): React.CSSProperties => {
      if (selectedEntity && selectedEntity.id === item.id) {
        return { color: "white" };
      }
      return {};
    };

    const selectedItemClass = (item: IEntity): string => {
      if (selectedEntity && selectedEntity.id === item.id) {
        return "bg-primary";
      }
      return "";
    };

    return (
      <li key={entity.id} className={selectedItemClass(entity)}>
        <EntityLink
          entity={entity}
          entityClicked={entityClicked}
          textClass={selectedItemClass(entity)}
        >
          <span
            className="glyphicon glyphicon-picture"
            style={selectedItemIconStyle(entity)}
          />
          &nbsp;
        </EntityLink>
      </li>
    );
  },
);

export default OrganizationItem;
