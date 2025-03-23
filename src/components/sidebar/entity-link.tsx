import * as React from "react";
import { IEntity } from "../../archimate-model";
import { entityClickedFunc } from "../common";

interface IProps {
  entity: IEntity | undefined;
  entityClicked: entityClickedFunc;
  text?: string;
  textClass?: string;
  children?: React.ReactNode;
}

const EntityLink: React.FC<IProps> = React.memo(
  ({ entity, entityClicked, text, textClass, children }) => {
    const handleClick = () => entityClicked(entity);

    if (!entity) {
      return null;
    }

    const displayText = text || entity.name;
    return (
      <a href={entity.href} onClick={handleClick}>
        {children}
        <span className={textClass}>{displayText}</span>
      </a>
    );
  },
);

export default EntityLink;
