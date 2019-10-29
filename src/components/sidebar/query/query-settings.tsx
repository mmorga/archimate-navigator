import * as React from "react";
import { Checkbox, Form, Panel } from "react-bootstrap";

interface IProps {
  autoLayout: boolean;
  onAutoLayoutToggled: (autoLayout: boolean) => void;
}

export default class QuerySettings extends React.PureComponent<IProps> {
  public render() {
    return (
      <Panel defaultExpanded={false}>
        <Panel.Heading>
          <Panel.Title componentClass="h3" toggle={true}>
            Query Settings
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
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
        </Panel.Collapse>
      </Panel>
    );
  }

  private autoLayoutToggled = (event: React.FormEvent<Checkbox>) => {
    this.props.onAutoLayoutToggled(!this.props.autoLayout);
  };
}
