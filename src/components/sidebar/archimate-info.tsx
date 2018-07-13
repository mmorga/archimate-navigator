import * as React from "react";
import {
  Diagram,
  IEntity,
  IHasRelationships,
  IHasViews,
  Relationship
} from "../../archimate-model";
import DocumentationPanel from "./info/documentation-panel";
import ElementsTable from "./info/elements-table";
import EntityIdPanel from "./info/entity-id-panel";
import PropertiesPanel from "./info/properties-panel";
import RelationshipsTable from "./info/relationships-table";
import ViewsTable from "./info/views-table";

interface IProps {
  entity?: IEntity;
  entityClicked: (entity: IEntity) => void;
}

export default class ArchimateInfo extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    // let viewpoint = "";
    let elements = null;
    let relationships = null;
    let views = null;
    let documentation = null;
    let properties = null;

    if (this.props.entity instanceof Diagram) {
      const diagram = this.props.entity as Diagram;
      // viewpoint = diagram.viewpoint;
      elements = (
        <ElementsTable
          elements={diagram.elements()}
          elementClicked={this.props.entityClicked}
        />
      );
    }
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element
    ) {
      relationships = (
        <RelationshipsTable
          relationships={(this.props
            .entity as IHasRelationships).relationships()}
          entityClicked={this.props.entityClicked}
        />
      );
    }
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element ||
      this.props.entity instanceof Relationship
    ) {
      const viewsEntity = this.props.entity as IHasViews;
      views = (
        <ViewsTable
          views={viewsEntity.diagrams()}
          entityClicked={this.props.entityClicked}
        />
      );
    }
    if (this.props.entity) {
      documentation = (
        <DocumentationPanel documentation={this.props.entity.documentation} />
      );
      properties = (
        <PropertiesPanel properties={this.props.entity.properties || []} />
      );
    }
    return (
      <div>
        <EntityIdPanel entity={this.props.entity} />
        {documentation}
        {properties}
        {elements}
        {relationships}
        {views}
      </div>
    );
  }
}
