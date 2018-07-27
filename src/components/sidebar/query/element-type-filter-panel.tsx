import * as React from "react";
import {
  Button,
  ButtonGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { ElementType, Query } from "../../../archimate-model";
import CollapsibleFormGroup, { ValidationState } from "./collapsible-form-group";
import ElementPicker from "./element-picker";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  showElementPicker: boolean;
  validationState: ValidationState;
}

export default class ElementTypeFilterPanel extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showElementPicker: false,
      validationState: this.validationState(),
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.query.elementTypes !== prevProps.query.elementTypes) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.validationState) {
        this.setState({validationState: newValidationState});
      }
    }
  }

  public render() {
    const tooltip = (
      <Tooltip id="element-type-tooltip">
        Select Elements Types to filter by
      </Tooltip>
    );
    return (
      <React.Fragment>
        <CollapsibleFormGroup
          defaultExpanded={false}
          label={this.label()}
          labelStyle={this.props.query.elementTypes.size === 0 ? "danger" : "default"}
          title="Element Types Filter"
          validationState={this.state.validationState}
        >
          <ButtonGroup>
            <OverlayTrigger placement="top" overlay={tooltip}>
              <Button onClick={this.onShowElementTypePicker}><Glyphicon glyph="plus-sign" /> Add...</Button>
            </OverlayTrigger>
          </ButtonGroup>
          {this.props.query.elementTypes.size > 0 ?
            <ListGroup>
              {this.props.query.elementTypes.map(el => (el ?
                <ListGroupItem key={el}>
                  <div className="pull-right">
                    <Button bsSize="xsmall" bsStyle="danger" onClick={this.onRemoveElementType.bind(this, el)}>
                      <Glyphicon glyph="remove" />
                    </Button>
                  </div>
                  <span className="text-primary">{el}</span>
                </ListGroupItem> : undefined
              ))}
            </ListGroup>
            : null}
          <HelpBlock>Element Types to include in results</HelpBlock>
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

  private onShowElementTypePicker = (event: any) => {
    this.setState({ showElementPicker: true });
  };

  private onRemoveElementType = (elementType: ElementType, event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes: this.props.query.elementTypes.remove(elementType)
      })
    );
  }

  private onCloseElementPicker = () => {
    this.setState({ showElementPicker: false });
  }

  private validationState = (): ValidationState => {
    return this.props.query.elementTypes.size > 0 ? null : "error";
  }

  private label() {
    const count = this.props.query.elementTypes.size; 
    switch (count) {
      case this.props.query.availableElementTypes().size:
        return "All";
      case 0:
        return "Pick one+";
      default:
        return count.toString(10);
    }
  }
}
