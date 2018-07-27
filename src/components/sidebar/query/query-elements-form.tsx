import { List } from "immutable";
import * as React from "react";
import {
  Button,
  ControlLabel,
  FormGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Element, Query } from "../../../archimate-model";
import ElementPicker from "./element-picker";

interface IProps {
  allElements: List<Element>;
  selectedElements: List<Element>;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  showElementPicker: boolean;
  valid: "success" | "warning" | "error";
}

export default class QueryElementsForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showElementPicker: false,
      valid: this.props.selectedElements.size > 0 ? "success" : "error",
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.selectedElements !== prevProps.selectedElements) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.valid) {
        this.setState({valid: newValidationState});
      }
    }
  }

  public render() {
    const tooltip = (
      <Tooltip>
        Add elements to the query.
      </Tooltip>
    );
    return (
      <React.Fragment>
        <FormGroup controlId="elements" validationState={this.state.valid}>
          <ControlLabel>Elements</ControlLabel>
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsSize="xsmall" className="pull-right" onClick={this.onShowElementPicker}>
              <Glyphicon glyph="plus-sign" /> Add...
            </Button>
          </OverlayTrigger>
          {this.props.selectedElements.size > 0 ?
            <ListGroup>
              {this.props.selectedElements.map(el => (el ?
                <ListGroupItem key={el.id}>
                  <div className="pull-right">
                    <Button bsSize="xsmall" bsStyle="danger" onClick={this.onRemoveElement.bind(this, el)}>
                      <Glyphicon glyph="remove" />
                    </Button>
                  </div>
                  <span className="text-info">{el.type}</span>{": "}
                  {<span className="text-primary">{el.name}</span> || <span className="text-muted">unnamed</span>}
                </ListGroupItem> : undefined
              ))}
            </ListGroup>
            : null}
          <HelpBlock>Elements to begin query with. Pick at least one.</HelpBlock>
        </FormGroup>
        <ElementPicker 
          allElements={this.props.allElements}
          selectedElements={this.props.selectedElements}
          onAdd={this.props.onAddElement}
          onRemove={this.props.onRemoveElement}
          onClose={this.onCloseElementPicker}
          show={this.state.showElementPicker}
        />
      </React.Fragment>
    );
  }

  private onShowElementPicker = (event: any) => {
    this.setState({ showElementPicker: true });
  };

  private onRemoveElement = (element: Element, event: any) => {
    this.props.onRemoveElement(element);
  }

  private onCloseElementPicker = () => {
    this.setState({ showElementPicker: false });
  }

  private validationState = () => {
    return this.props.selectedElements.size > 0 ? "success" : "error";
  }
}
