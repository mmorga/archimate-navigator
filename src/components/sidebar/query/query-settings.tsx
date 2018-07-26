import * as React from "react";
import {
  Checkbox,
  Form,
  Panel
} from "react-bootstrap";

interface IProps {
  autoLayout: boolean;
  onAutoLayoutToggled: (autoLayout: boolean) => void,
}

export default class QuerySettings extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel>
        <Panel.Heading>Query Settings</Panel.Heading>
        <Panel.Body>
          <Form>
            <Checkbox
              defaultChecked={this.props.autoLayout}
              onChange={this.autoLayoutToggled}
            > 
              {" Auto Layout "}
            </Checkbox>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }

  private autoLayoutToggled = (event: React.FormEvent<Checkbox>) => {
    this.props.onAutoLayoutToggled(!this.props.autoLayout);
  };
}
