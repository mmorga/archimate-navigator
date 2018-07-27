import * as React from "react";
import {
  Button,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
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

export default class ElementsPanel extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showElementPicker: false,
      valid: this.props.query.elements.size > 0 ? "success" : "error",
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.query.elements !== prevProps.query.elements) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.valid) {
        this.setState({valid: newValidationState});
      }
    }
  }

  public render() {
    const tooltip = (
      <Tooltip id="elements-tooltip">
        Add elements to the query.
      </Tooltip>
    );
    return (
      <React.Fragment>
        <CollapsibleFormGroup
          label={this.label()}
          labelStyle={this.props.query.elements.size === 0 ? "danger" : "default"}
          defaultExpanded={true}
          title="Elements"
          validationState={this.state.valid}
        >
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsSize="xsmall" className="pull-right" onClick={this.onShowElementPicker}>
              <Glyphicon glyph="plus-sign" /> Add...
            </Button>
          </OverlayTrigger>
          {this.props.query.elements.size > 0 ?
            <ListGroup>
              {this.props.query.elements.map(el => (el ?
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
        </CollapsibleFormGroup>
        <ElementPicker
          query={this.props.query}
          onChange={this.props.onQueryChanged}
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
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elements: this.props.query.elements.remove(element)
      })
    );
  }

  private onCloseElementPicker = () => {
    this.setState({ showElementPicker: false });
  }

  private validationState = () => {
    return this.props.query.elements.size > 0 ? "success" : "error";
  }

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
