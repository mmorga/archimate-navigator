import * as React from "react";
import { IEntity } from "../old-model/entity";
import Folder from "../old-model/folder";
import EntityLink from "./entity-link";
import FolderItem from "./folder-item";

interface IProps {
    views: Folder;
    entityClicked: (entity: IEntity) => void;
}

export default class ArchimateDiagramTree extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let folderChildren = [(<li key="loading">Loading</li>)];
        let diagramChildren: JSX.Element[] = [];
        if (this.props.views) {
            folderChildren = this.props.views.folders.map((folder) =>
                <FolderItem key={folder.id} folder={folder} entityClicked={this.props.entityClicked}/>,
            );
            diagramChildren = this.props.views.diagrams.map((diagram) => (
                <li key={diagram.id}>
                    <EntityLink entity={diagram} entityClicked={this.props.entityClicked}>
                        <span className="glyphicon glyphicon-picture" />&nbsp;
                    </EntityLink>
                </li>),
            );
        }
        return (
            <div className="panel panel-default">
                <div id="archimate-view-index" className="panel-body archimate-view-index">
                    <ul>
                        {folderChildren}
                        {diagramChildren}
                    </ul>
                </div>
            </div>
        );
    }
}
