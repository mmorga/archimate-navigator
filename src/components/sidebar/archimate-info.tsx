import * as React from "react";
import Element from "../../old-model/element";
import Entity from "../../old-model/entity";
import OldDiagram, {IHasViews} from "../../old-model/old-diagram";
import Relationship, {IHasRelationships} from "../../old-model/relationship";
import DocumentationPanel from "./info/documentation-panel";
import ElementsTable from "./info/elements-table";
import EntityIdPanel from "./info/entity-id-panel";
import PropertiesPanel from "./info/properties-panel";
import RelationshipsTable from "./info/relationships-table";
import ViewsTable from "./info/views-table";

interface IProps {
    entity?: Entity;
    entityClicked: (entity: Entity) => void;
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

        if (this.props.entity instanceof OldDiagram) {
            const diagram = this.props.entity as OldDiagram;
            // viewpoint = diagram.viewpoint;
            elements = (
                <ElementsTable
                    elements={diagram.elements}
                    elementClicked={this.props.entityClicked}
                />
            );
        }
        if ((this.props.entity instanceof OldDiagram) || (this.props.entity instanceof Element)) {
            relationships = (
                <RelationshipsTable
                    relationships={(this.props.entity as IHasRelationships).relationships}
                    entityClicked={this.props.entityClicked}
                />
            );
        }
        if ((this.props.entity instanceof OldDiagram) ||
            (this.props.entity instanceof Element) ||
            (this.props.entity instanceof Relationship)) {
            const viewsEntity = this.props.entity as IHasViews;
            views = (
                <ViewsTable
                    views={viewsEntity.views}
                    entityClicked={this.props.entityClicked}
                />
            );
        }
        if (this.props.entity) {
            documentation = <DocumentationPanel documentation={this.props.entity.documentation || []} />
            properties = <PropertiesPanel properties={this.props.entity.properties || []} />
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
