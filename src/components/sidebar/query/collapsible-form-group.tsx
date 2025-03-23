import * as React from "react";
import { JSX } from "react";
import { Accordion, Badge } from "react-bootstrap";

export type ValidationState = "success" | "warning" | "error" | null;

interface IProps {
  label?: string | JSX.Element;
  labelStyle?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger";
  defaultExpanded?: boolean;
  title: string | JSX.Element;
  validationState?: ValidationState;
  children?: React.ReactNode;
}

export default class CollapsibleFormGroup extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Accordion
        defaultActiveKey={this.props.defaultExpanded ? "0" : undefined}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className={this.titleClass()}>{this.props.title}</span>
            {this.props.label ? (
              <Badge bg={this.props.labelStyle}>{this.props.label}</Badge>
            ) : null}
          </Accordion.Header>
          <Accordion.Body>{this.props.children}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  private titleClass(): string | undefined {
    switch (this.props.validationState) {
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
