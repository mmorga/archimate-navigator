import { Set } from "immutable";
import * as React from "react";
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import {
  Query,
  RelationshipType,
  RelationshipTypes,
} from "../../../archimate-model";
import CollapsibleFormGroup, {
  ValidationState,
} from "./collapsible-form-group";
import { JSX } from "react";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  validationState: ValidationState;
}

export default class RelationshipTypeFilterPanel extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      validationState: this.validationState(),
    };
  }

  public render() {
    const noneTooltip = (
      <Tooltip id="relationship-type-none-tooltip">
        Unselect all Relationship Types
      </Tooltip>
    );
    const allTooltip = (
      <Tooltip id="relationship-type-all-tooltip">
        Select all Relationship Types
      </Tooltip>
    );
    return (
      <CollapsibleFormGroup
        label={this.label()}
        labelStyle={
          this.props.query.relationshipTypes.size === 0 ? "danger" : "info"
        }
        defaultExpanded={false}
        title="Relationship Types Filter"
        validationState={this.state.validationState}
      >
        <FormGroup>
          <Form.Check
            type="checkbox"
            onChange={this.onDerivedRelationsToggle}
            label="Include Derived Relations"
          />
        </FormGroup>

        <ButtonGroup>
          <OverlayTrigger placement="top" overlay={allTooltip}>
            <Button onClick={this.onSelectAll}>All</Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={noneTooltip}>
            <Button onClick={this.onSelectNone}>None</Button>
          </OverlayTrigger>
        </ButtonGroup>
        <ListGroup>
          {RelationshipTypes.sort().map((el) =>
            el ? (
              <ListGroupItem key={el}>
                <div className="pull-right">
                  {this.addRemoveRelationshipType(el)}
                </div>
                {<span className="text-primary">{el}</span>}
              </ListGroupItem>
            ) : undefined,
          )}
        </ListGroup>
        <Form.Text muted>Relationship Types to include in the query</Form.Text>
      </CollapsibleFormGroup>
    );
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.query.relationshipTypes !== prevProps.query.relationshipTypes
    ) {
      const newValidationState = this.validationState();
      if (newValidationState !== prevState.validationState) {
        this.setState({ validationState: newValidationState });
      }
    }
  }

  private validationState(): ValidationState {
    if (this.props.query.relationshipTypes.size === 0) {
      return "error";
    } else {
      return null;
    }
  }

  private onSelectAll = () => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        relationshipTypes: Set<RelationshipType>(RelationshipTypes),
      }),
    );
  };

  private onSelectNone = () => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        relationshipTypes: Set<RelationshipType>(),
      }),
    );
  };

  private onAddClick = (relationshipType: RelationshipType, _event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        relationshipTypes:
          this.props.query.relationshipTypes.add(relationshipType),
      }),
    );
  };

  private onRemoveClick = (relationshipType: RelationshipType, _event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        relationshipTypes:
          this.props.query.relationshipTypes.remove(relationshipType),
      }),
    );
  };

  private onDerivedRelationsToggle = (_event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        includeDerivedRelations: !this.props.query.includeDerivedRelations,
      }),
    );
  };

  private addRemoveRelationshipType(el: RelationshipType): JSX.Element {
    // TODO: should be working with Immutable v4
    // const isSelected = this.props.query.relationshipTypes.includes(el);
    const isSelected = this.props.query.relationshipTypes.some((e) =>
      e ? e === el : false,
    );
    const onClick = isSelected
      ? this.onRemoveClick.bind(this, el)
      : this.onAddClick.bind(this, el);
    const bsStyle = isSelected ? "danger" : "primary";
    return (
      <Button size="sm" variant={bsStyle} onClick={onClick}>
        {isSelected ? <Trash /> : <Plus />}
      </Button>
    );
  }

  private label() {
    const count = this.props.query.relationshipTypes.size;
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
