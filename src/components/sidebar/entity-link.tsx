import * as React from "react";
import Entity from "../../old-model/entity";

interface IProps {
    entity: Entity;
    entityClicked: (entity: Entity) => void;
    text?: string;
}

export default class EntityLink extends React.PureComponent <IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const text = this.props.text ? this.props.text : this.props.entity.name;
        return (
            <a href={this.props.entity.href} onClick={this.entityClicked}>
                {this.props.children}
                {text}
            </a>
        );
    }

    private entityClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (this.props.entityClicked) {
            this.props.entityClicked(this.props.entity);
        }
    }
}
