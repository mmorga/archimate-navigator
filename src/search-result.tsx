import * as React from "react";
import Element from "./element";
import Entity from "./entity";
import EntityLink from "./entity-link";
import OldDiagram from "./old-diagram";
import Relationship from "./relationship";

interface IProps {
    entity: Entity;
    resultClicked: (entity: Entity) => void;
}

export default class SearchResult extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <li>
                <EntityLink
                    entity={this.props.entity}
                    entityClicked={this.props.resultClicked}
                    text={`${this.props.entity.name} (${this.entityType()})`}
                />
            </li>
        );
    }

    private entityType(): string {
        const entity = this.props.entity;
        let entityType = entity.type;
        if (entity instanceof Element) {
            entityType = entity.elementType || entityType;
        } else if (entity instanceof Relationship) {
            entityType = entity.relationshipType || entityType;
        } else if (entity instanceof OldDiagram) {
            entityType = entity.viewpoint || "Total";
        }
        return entityType;
    }
}
