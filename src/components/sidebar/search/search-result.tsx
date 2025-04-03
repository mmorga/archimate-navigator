import {
  Diagram,
  Element,
  IEntity,
  Relationship,
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";

type IProps = {
  entity: IEntity;
  resultClicked: entityClickedFunc;
};

export default function SearchResult(props: IProps) {
  const entityType = (): string => {
    const entity = props.entity;
    let entityType = entity.type;
    if (entity instanceof Element) {
      entityType = entity.type || entityType;
    } else if (entity instanceof Relationship) {
      entityType = entity.type || entityType;
    } else if (entity instanceof Diagram) {
      entityType = entity.viewpoint || "Total";
    }
    return entityType;
  };

  return (
    <li>
      <EntityLink
        entity={props.entity}
        entityClicked={props.resultClicked}
        text={`${props.entity.name} (${entityType()})`}
      />
    </li>
  );
}
