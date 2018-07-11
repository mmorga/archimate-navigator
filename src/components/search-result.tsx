import * as React from "react";
import Element from "../old-model/element";
import Entity from "../old-model/entity";
import OldDiagram from "../old-model/old-diagram";
import Relationship from "../old-model/relationship";
import EntityLink from "./entity-link";

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
