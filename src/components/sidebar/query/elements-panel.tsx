import * as React from "react";
import {
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import { Element, Query } from "../../../archimate-model";
import CollapsibleFormGroup from "./collapsible-form-group";
import ElementPicker from "./element-picker";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  showElementPicker: boolean;
  valid: "success" | "warning" | "error";
}

export default class ElementsPanel extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showElementPicker: false,
      valid: this.props.query.elements.size > 0 ? "success" : "error",
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.query.elements !== prevProps.query.elements) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.valid) {
        this.setState({ valid: newValidationState });
      }
    }
  }

  public render() {
    const tooltip = (
      <Tooltip id="elements-tooltip">Add elements to the query.</Tooltip>
    );
    return (
      <>
        <CollapsibleFormGroup
          label={this.label()}
          labelStyle={this.props.query.elements.size === 0 ? "danger" : "info"}
          defaultExpanded={true}
          title="Elements"
          validationState={this.state.valid}
        >
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button onClick={this.onShowElementPicker}>
              <PlusCircle /> Add...
            </Button>
          </OverlayTrigger>
          {this.props.query.elements.size > 0 ? (
            <ListGroup>
              {this.props.query.elements.toArray().map((el) =>
                el ? (
                  <ListGroupItem key={el.id}>
                    <div className="pull-right">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={this.onRemoveElement.bind(this, el)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <span className="text-info">{el.type}</span>
                    {": "}
                    {el.name ? (
                      <span className="text-primary">{el.name}</span>
                    ) : (
                      <span className="text-muted">unnamed</span>
                    )}
                  </ListGroupItem>
                ) : undefined,
              )}
            </ListGroup>
          ) : null}
          <Form.Text muted>
            Elements to begin query with. Pick at least one.
          </Form.Text>
        </CollapsibleFormGroup>
        <ElementPicker
          query={this.props.query}
          onChange={this.props.onQueryChanged}
          onClose={this.onCloseElementPicker}
          show={this.state.showElementPicker}
        />
      </>
    );
  }

  private onShowElementPicker = () => {
    this.setState({ showElementPicker: true });
  };

  private onRemoveElement = (element: Element) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elements: this.props.query.elements.remove(element),
      }),
    );
  };

  private onCloseElementPicker = () => {
    this.setState({ showElementPicker: false });
  };

  private validationState = () => {
    return this.props.query.elements.size > 0 ? "success" : "error";
  };

  private label() {
    const count = this.props.query.elements.size;
    switch (count) {
      case 0:
        return "Pick one+";
      default:
        return count.toString(10);
    }
  }
}
