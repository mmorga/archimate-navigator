import * as React from "react";
import Entity from "../old-model/entity";
import Folder from "../old-model/folder";
import EntityLink from "./entity-link";

interface IProps {
    folder: Folder;
    entityClicked: (entity: Entity) => void;
}

interface IState {
    collapse: boolean;
}

// TODO: save the open closed state to localStorage
// (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
export default class FolderItem extends React.PureComponent<IProps, IState> {
    public state: IState;

    constructor(props: IProps) {
        super(props);
        this.state = {
            collapse: true,
        };
    }

    public render() {
        const collapsed: any = {className: null};
        let icon = "glyphicon glyphicon-folder-close";
        if (this.state.collapse) {
            collapsed.className = "collapse";
            icon = "glyphicon glyphicon-folder-open";
        }
        const folderChildren: any = this.props.folder.folders.map(
            (folder) => <FolderItem key={folder.id} folder={folder} entityClicked={this.props.entityClicked}/>);
        const diagramChildren = this.props.folder.diagrams.map(
            (diagram) =>
                <li key={diagram.id}>
                    <EntityLink entity={diagram} entityClicked={this.props.entityClicked}/>
                </li>,
        );
        const ulId = `${this.props.folder.id}`;
        const linkHref = `#${ulId}`;
        return (
            <li key={this.props.folder.id} id={this.props.folder.id}>
                <a
                    className="archimate-folder text-muted"
                    role="button"
                    data-toggle="collapse"
                    href={linkHref}
                    onClick={this.handleClick}
                >
                    <span className={icon} /> {this.props.folder.name}
                </a>
                <ul id={ulId} {...collapsed}>
                    {folderChildren}
                    {diagramChildren}
                </ul>
            </li>
        );
    }

    private handleClick = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        this.setState({collapse: !this.state.collapse});
    }
}
