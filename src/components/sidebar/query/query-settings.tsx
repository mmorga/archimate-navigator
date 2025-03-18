import * as React from "react";
import { Accordion, Form } from "react-bootstrap";

interface IProps {
  autoLayout: boolean;
  onAutoLayoutToggled: (autoLayout: boolean) => void;
}

export default class QuerySettings extends React.PureComponent<IProps> {
  public render() {
    return (
      <Accordion defaultActiveKey="">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Query Settings</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Check
                type="checkbox"
                defaultChecked={this.props.autoLayout}
                onChange={this.autoLayoutToggled}
                label="Auto Layout"
              />
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  private autoLayoutToggled = () => {
    this.props.onAutoLayoutToggled(!this.props.autoLayout);
  };
}
