import { PureComponent } from "react";
import { Form } from "react-bootstrap";
import { Layer } from "../../../../archimate-model";

interface IProps {
  layer: Layer;
  checked: boolean;
  onChange: (layer: Layer, checked: boolean) => void;
}

export default class LayerCheckbox extends PureComponent<IProps> {
  public render() {
    return (
      <Form.Check
        type="checkbox"
        checked={this.props.checked}
        onChange={this.onChange}
        label={this.props.layer}
      />
    );
  }

  private onChange = () => {
    this.props.onChange(this.props.layer, !this.props.checked);
  };
}
