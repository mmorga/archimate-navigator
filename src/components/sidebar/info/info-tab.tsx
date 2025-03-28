import * as React from "react";
import { JSX } from "react";
import {
  Diagram,
  Element,
  IEntity,
  IHasRelationships,
  IHasViews,
  Relationship,
} from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import DocumentationPanel from "./documentation-panel";
import ElementsTable from "./elements-table";
import EntityIdPanel from "./entity-id-panel";
import PropertiesPanel from "./properties-panel";
import RelationshipsTable from "./relationships-table";
import ViewsTable from "./views-table";

interface IProps {
  entity?: IEntity;
  entityClicked: entityClickedFunc;
}

// const InfoTab: React.FC<IProps> = React.memo(({ entity, entityClicked }) => {
const InfoTab: React.FC<IProps> = ({ entity, entityClicked }) => {
  const elements = (): JSX.Element | undefined => {
    if (entity instanceof Diagram) {
      const diagram = entity as Diagram;
      return (
        <ElementsTable
          elements={diagram.elements()}
          elementClicked={entityClicked}
        />
      );
    }
    return undefined;
  };

  const relationships = (): JSX.Element | undefined => {
    if (entity instanceof Diagram || entity instanceof Element) {
      return (
        <RelationshipsTable
          relationships={(entity as IHasRelationships).relationships()}
          entityClicked={entityClicked}
        />
      );
    }
    return undefined;
  };

  const views = (): JSX.Element | undefined => {
    if (
      entity instanceof Diagram ||
      entity instanceof Element ||
      entity instanceof Relationship
    ) {
      const viewsEntity = entity as IHasViews;
      return (
        <ViewsTable
          views={viewsEntity.diagrams()}
          entityClicked={entityClicked}
        />
      );
    }
    return undefined;
  };

  const properties = (): JSX.Element | undefined => {
    if (entity === undefined) {
      return undefined;
    }
    return <PropertiesPanel properties={entity.properties || []} />;
  };

  return (
    <>
      <EntityIdPanel entity={entity} entityClicked={entityClicked} />
      <DocumentationPanel str={entity ? entity.documentation : undefined} />
      {properties()}
      {elements()}
      {relationships()}
      {views()}
    </>
  );
};

export default InfoTab;
