import * as React from "react";
import {
  Badge,
  FormGroup,
  Panel,
} from "react-bootstrap";

interface IProps {
  badge?: React.ReactText | JSX.Element;
  controlId?: string;
  defaultExpanded?: boolean;
  title: string | JSX.Element;
}

export default class CollapsibleFormGroup extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Panel defaultExpanded={this.props.defaultExpanded} style={{margin: "0 -13px 0 -13px"}}>
          <Panel.Heading>
            <Panel.Title toggle={true}>
              {this.props.title}
              {this.props.badge ? <Badge className="pull-right">{this.props.badge}</Badge> : null}
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <FormGroup controlId={this.props.controlId}>
                {this.props.children}
              </FormGroup>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </React.Fragment>
    );
  }
}
