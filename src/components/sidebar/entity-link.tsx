import * as React from "react";
import { IEntity } from "../../archimate-model";

interface IProps {
  entity: IEntity | undefined;
  entityClicked: (entity: IEntity) => void;
  text?: string;
}

export default class EntityLink extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const text = this.props.text ? this.props.text : this.props.entity!.name;
    if (this.props.entity) {
      return (
        <a href={this.props.entity!.href} onClick={this.entityClicked}>
          {this.props.children}
          {text}
        </a>
      );
    } else {
      return undefined;
    }
  }

  private entityClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (this.props.entityClicked && this.props.entity) {
      this.props.entityClicked(this.props.entity);
    }
  };
}
