import { Set } from "immutable";
import * as React from "react";
import {
  Button,
  ButtonGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { RelationshipType, RelationshipTypes } from "../../../archimate-model";
import CollapsibleFormGroup, {
  ValidationState
} from "./collapsible-form-group";

interface IProps {
  selectedRelationshipTypes: Set<RelationshipType>;
  onChange: (relationshipTypes: Set<RelationshipType>) => void;
}

interface IState {
  validationState: ValidationState;
}

export default class RelationshipTypeFilterForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      validationState: this.validationState()
    };
  }

  public render() {
    const noneTooltip = <Tooltip>Unselect all Relationship Types</Tooltip>;
    const allTooltip = <Tooltip>Select all Relationship Types</Tooltip>;
    return (
      <React.Fragment>
        <CollapsibleFormGroup
          label={this.label()}
          labelStyle={this.props.selectedRelationshipTypes.size === 0 ? "danger" : "default"}
          controlId="relationship-types"
          defaultExpanded={false}
          title="Relationship Types Filter"
          validationState={this.state.validationState}
        >
          <ButtonGroup>
            <OverlayTrigger placement="top" overlay={allTooltip}>
              <Button onClick={this.onSelectAll}>All</Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={noneTooltip}>
              <Button onClick={this.onSelectNone}>None</Button>
            </OverlayTrigger>
          </ButtonGroup>
          <ListGroup>
            {RelationshipTypes.sort().map(
              el =>
                el ? (
                  <ListGroupItem key={el}>
                    <div className="pull-right">
                      {this.addRemoveRelationshipType(el)}
                    </div>
                    {<span className="text-primary">{el}</span>}
                  </ListGroupItem>
                ) : (
                  undefined
                )
            )}
          </ListGroup>
          <HelpBlock>Relationship Types to include in the query</HelpBlock>
        </CollapsibleFormGroup>
      </React.Fragment>
    );
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.selectedRelationshipTypes !==
      prevProps.selectedRelationshipTypes
    ) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.validationState) {
        this.setState({ validationState: newValidationState });
      }
    }
  }

  private validationState(): ValidationState {
    if (this.props.selectedRelationshipTypes.size === 0) {
      return "error";
    } else {
      return null;
    }
  }

  private onSelectAll = () => {
    this.props.onChange(Set<RelationshipType>(RelationshipTypes));
  };
  private onSelectNone = () => {
    this.props.onChange(Set<RelationshipType>());
  };

  private onAddClick = (relationshipType: RelationshipType, event: any) => {
    this.props.onChange(
      this.props.selectedRelationshipTypes.add(relationshipType)
    );
  };

  private onRemoveClick = (relationshipType: RelationshipType, event: any) => {
    this.props.onChange(
      this.props.selectedRelationshipTypes.remove(relationshipType)
    );
  };

  private addRemoveRelationshipType(el: RelationshipType): JSX.Element {
    // TODO: should be working with Immutable v4
    // const isSelected = this.props.selectedRelationshipTypes.includes(el);
    const isSelected = this.props.selectedRelationshipTypes.some(
      e => (e ? e === el : false)
    );
    const glyph = isSelected ? "remove" : "plus";
    const onClick = isSelected
      ? this.onRemoveClick.bind(this, el)
      : this.onAddClick.bind(this, el);
    const bsStyle = isSelected ? "danger" : "primary";
    return (
      <Button bsSize="xsmall" bsStyle={bsStyle} onClick={onClick}>
        <Glyphicon glyph={glyph} />
      </Button>
    );
  }

  private label() {
    const count = this.props.selectedRelationshipTypes.size; 
    switch (count) {
      case RelationshipTypes.length:
        return "All";
      case 0:
        return "Pick one+";
      default:
        return count.toString(10);
    }
  }
}
