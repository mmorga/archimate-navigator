import * as React from "react";
import {
  Diagram,
  Element,
  IEntity,
  IHasRelationships,
  IHasViews,
  Relationship
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

export default class InfoTab extends React.PureComponent<IProps> {
  public render() {
    return (
      <>
        <EntityIdPanel
          entity={this.props.entity}
          entityClicked={this.props.entityClicked}
        />
        <DocumentationPanel
          str={this.props.entity ? this.props.entity.documentation : undefined}
        />
        {this.properties()}
        {this.elements()}
        {this.relationships()}
        {this.views()}
      </>
    );
  }

  private elements(): JSX.Element | undefined {
    if (this.props.entity instanceof Diagram) {
      const diagram = this.props.entity as Diagram;
      return (
        <ElementsTable
          elements={diagram.elements()}
          elementClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }
  }
  private relationships(): JSX.Element | undefined {
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element
    ) {
      return (
        <RelationshipsTable
          relationships={(this.props
            .entity as IHasRelationships).relationships()}
          entityClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }
  }

  private views(): JSX.Element | undefined {
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element ||
      this.props.entity instanceof Relationship
    ) {
      const viewsEntity = this.props.entity as IHasViews;
      return (
        <ViewsTable
          views={viewsEntity.diagrams()}
          entityClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }
  }
  private properties(): JSX.Element | undefined {
    if (this.props.entity === undefined) {
      return undefined;
    }
    return <PropertiesPanel properties={this.props.entity.properties || []} />;
  }
}
