import { ReactNode, JSX } from "react";
import { Accordion, Badge } from "react-bootstrap";

export type ValidationState = "success" | "warning" | "error" | null;

type IProps = {
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
  children?: ReactNode;
};

const CollapsibleFormGroup = (props: IProps) => {
  const titleClass = (): string | undefined => {
    switch (props.validationState) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-danger";
      default:
        return undefined;
    }
  };

  return (
    <Accordion defaultActiveKey={props.defaultExpanded ? "0" : undefined}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span className={titleClass()}>{props.title}</span>
          {props.label ? (
            <Badge bg={props.labelStyle}>{props.label}</Badge>
          ) : null}
        </Accordion.Header>
        <Accordion.Body>{props.children}</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CollapsibleFormGroup;
