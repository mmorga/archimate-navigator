import * as React from "react";
import {
  Button,
  ButtonGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import {
  ElementType,
  EmptyElementTypeSet,
  Query
} from "../../../archimate-model";
import CollapsibleFormGroup, {
  ValidationState
} from "./collapsible-form-group";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  validationState: ValidationState;
}

export default class ElementTypeFilterPanel extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      validationState: this.validationState()
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.query.elementTypes !== prevProps.query.elementTypes) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.validationState) {
        this.setState({ validationState: newValidationState });
      }
    }
  }

  public render() {
    return (
      <CollapsibleFormGroup
        defaultExpanded={false}
        label={this.label()}
        labelStyle={
          this.props.query.elementTypes.size === 0 ? "danger" : "default"
        }
        title="Element Types Filter"
        validationState={this.state.validationState}
      >
        <ButtonGroup>
          <Button onClick={this.onAll}>All</Button>
          <Button onClick={this.onNone}>None</Button>
        </ButtonGroup>
        <ListGroup>
          {this.props.query.elementTypes
            .sort()
            .map(
              el =>
                el ? (
                  <ListGroupItem key={el}>
                    <div className="pull-right">
                      <Button
                        bsSize="xsmall"
                        bsStyle="danger"
                        onClick={this.onRemoveElementType.bind(this, el)}
                      >
                        <Glyphicon glyph="remove" />
                      </Button>
                    </div>
                    <span className="text-primary">{el}</span>
                  </ListGroupItem>
                ) : (
                  undefined
                )
            )
            .concat(
              this.props.query
                .unselectedElementTypes()
                .sort()
                .map(
                  el =>
                    el ? (
                      <ListGroupItem key={el}>
                        <div className="pull-right">
                          <Button
                            bsSize="xsmall"
                            bsStyle="success"
                            onClick={this.onAddElementType.bind(this, el)}
                          >
                            <Glyphicon glyph="plus" />
                          </Button>
                        </div>
                        <span className="text-primary">{el}</span>
                      </ListGroupItem>
                    ) : (
                      undefined
                    )
                )
            )}
        </ListGroup>
        <HelpBlock>Element Types to include in results</HelpBlock>
      </CollapsibleFormGroup>
    );
  }

  private onAll = () => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes: this.props.query.availableElementTypes()
      })
    );
  };

  private onNone = () => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes: EmptyElementTypeSet
      })
    );
  };

  private onAddElementType = (elementType: ElementType, event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes: this.props.query.elementTypes.add(elementType)
      })
    );
  };

  private onRemoveElementType = (elementType: ElementType, event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes: this.props.query.elementTypes.remove(elementType)
      })
    );
  };

  private validationState = (): ValidationState => {
    return this.props.query.elementTypes.size > 0 ? null : "error";
  };

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
