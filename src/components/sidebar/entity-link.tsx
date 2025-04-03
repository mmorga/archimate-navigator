import { memo, ReactNode } from "react";
import { IEntity } from "../../archimate-model";
import { entityClickedFunc } from "../common";

type IProps = {
  entity: IEntity | undefined;
  entityClicked: entityClickedFunc;
  text?: string;
  textClass?: string;
  children?: ReactNode;
};

const EntityLink = memo(
  ({ entity, entityClicked, text, textClass, children }: IProps) => {
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
