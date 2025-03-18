import * as React from "react";
import { Checkbox } from "react-bootstrap";
import { Layer } from "../../../../archimate-model";

interface IProps {
  layer: Layer;
  checked: boolean;
  onChange: (layer: Layer, checked: boolean) => void;
}

export default class LayerCheckbox extends React.PureComponent<IProps> {
  public render() {
    return (
      <Checkbox
        checked={this.props.checked}
        onClick={this.onChange}
      >
        {this.props.layer}
      </Checkbox>
    );
  }

  private onChange = (_event: React.FormEvent<Checkbox>) => {
    this.props.onChange(this.props.layer, !this.props.checked);
  };
}
