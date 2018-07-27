import * as React from "react";
import {
  FormGroup,
  Label,
  Panel,
} from "react-bootstrap";

export type ValidationState = "success" | "warning" | "error" | null;

interface IProps {
  eventKey: string;
  expanded: boolean;
  label?: React.ReactText | JSX.Element;
  labelStyle?: "default" | "primary" | "success" | "info" | "warning" | "danger";
  controlId?: string;
  defaultExpanded?: boolean;
  title: string | JSX.Element;
  validationState?: ValidationState;
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
      <Panel eventKey={this.props.eventKey} expanded={this.props.expanded} style={{margin: "0 -13px 0 -13px"}}>
        <Panel.Heading>
          <Panel.Title toggle={true}>
            <span className={this.titleClass()}>
              {this.props.title}
            </span>
            {this.props.label ? <Label bsStyle={this.props.labelStyle} className="pull-right">{this.props.label}</Label> : null}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible={true}>
          <FormGroup controlId={this.props.controlId}>
            {this.props.children}
          </FormGroup>
        </Panel.Body>
      </Panel>
    );
  }

  private titleClass(): string | undefined {
    switch(this.props.validationState) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-danger";
      default:
        return undefined;
    }
  }
}
