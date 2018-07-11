import * as React from "react";
import Element from "../old-model/element";
import Entity from "../old-model/entity";
import OldDiagram from "../old-model/old-diagram";
import Relationship from "../old-model/relationship";
import Panel from "./panel";

interface IProps {
    entity?: Entity;
}

export default class EntityIdPanel extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const entity = this.props.entity;
        const diagramRow = (entity instanceof OldDiagram) ? (
            <tr key="viewpoint">
                <th>Viewpoint</th>
                <td>{entity.viewpoint}</td>
            </tr>
        ) : null;
        const relationshipRow = (entity instanceof Relationship) ? (
            <tr key="relationship-type">
                <th>Relationship Type</th>
                <td>{entity.relationshipType}</td>
            </tr>
        ) : null;
        const elementRow = (entity instanceof Element) ? (
            <tr key="element-type">
                <th>Element Type</th>
                <td>{(entity as Element).elementType}</td>
            </tr>
        ) : null;
        const undefinedRow = (entity === undefined) ? "Nothing Selected" : null;
        const name = entity ? entity.name : null;
        const entityType = entity ? entity.type : null;
        return (
            <Panel>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{entityType}</td>
                        </tr>
                        {diagramRow}
                        {relationshipRow}
                        {elementRow}
                        {undefinedRow}
                    </tbody>
                </table>
            </Panel>
        );
    }
}
