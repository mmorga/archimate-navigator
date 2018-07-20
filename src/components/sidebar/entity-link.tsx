import * as React from "react";
import { IEntity } from "../../archimate-model";
import { entityClickedFunc } from "../common";

interface IProps {
  entity: IEntity | undefined;
  entityClicked: entityClickedFunc;
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
        <a href={this.props.entity!.href} onClick={this.props.entityClicked.bind(this, this.props.entity)}>
          {this.props.children}
          {text}
        </a>
      );
    } else {
      return undefined;
    }
  }
}
