import * as React from "react";
import Element from "./element";
import Entity from "./entity";
import EntityLink from "./entity-link";
import Panel from "./panel";

interface IProps {
    elements: Element[];
    elementClicked: (entity: Entity) => void;
}

export default class ElementsTable extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let elementRows = [(
            <tr key="no-elements">
                <td colSpan={4}>
                    <p className="text-info">No elements</p>
                </td>
            </tr>
        )];

        if (this.props.elements.length > 0) {
            elementRows = this.props.elements.map((element) => {
                return (
                    <tr key={element.id}>
                        <td>
                            <EntityLink
                                entity={element}
                                entityClicked={this.props.elementClicked}
                            />
                        </td>
                        <td>
                            {element.elementType}
                        </td>
                    </tr>
                );
            });
        }
        return(
            <Panel header="Elements">
                <table className="table archimate-elements-table">
                    <thead>
                        <tr key="elements-header">
                            <th>Element</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elementRows}
                    </tbody>
                </table>
            </Panel>
        );
    }
}
