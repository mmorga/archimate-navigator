import { List } from "immutable";
import * as React from "react";
import {
  Button,
  ButtonGroup,
  ControlLabel,
  FormGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
  Well,
} from "react-bootstrap";
import { RelationshipType, RelationshipTypes } from "../../../archimate-model";
import RelationshipTypePicker from "./relationship-type-picker";

interface IProps {
  selectedRelationshipTypes: List<RelationshipType>;
  onAddRelationshipType: (relationshipType: RelationshipType) => void;
  onRemoveRelationshipType: (relationshipType: RelationshipType) => void;
}

interface IState {
  showRelationshipTypePicker: boolean;
}

export default class RelationshipTypeFilterForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showRelationshipTypePicker: false,
    }
  }

  public render() {
    const tooltip = (
      <Tooltip>
        Select Relationship Types filter criteria
      </Tooltip>
    );
    const allTooltip = (
      <Tooltip>
        Select all Relationship Types
      </Tooltip>
    );
    return (
      <React.Fragment>
        <FormGroup controlId="relationship-types">
          <ControlLabel>Relationship Types Filter</ControlLabel>
          <ButtonGroup className="pull-right">
          <OverlayTrigger placement="right" overlay={allTooltip}>
              <Button bsSize="xsmall" onClick={this.onSelectAll}>
                All
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" overlay={tooltip}>
              <Button bsSize="xsmall" onClick={this.onShowRelationshipTypePicker}>
                Select...
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          {this.props.selectedRelationshipTypes.size > 0 ?
          <Well>
            {this.props.selectedRelationshipTypes.size < RelationshipTypes.length ?
            <ListGroup>
              {this.props.selectedRelationshipTypes.map(el => (el ?
                <ListGroupItem key={el}>
                  <div className="pull-right">
                    <Button bsSize="xsmall" bsStyle="danger" onClick={this.onRemoveRelationshipType.bind(this, el)}>
                      <Glyphicon glyph="remove" />
                    </Button>
                  </div>
                  {<span className="text-primary">{el}</span>}
                </ListGroupItem> : undefined
              ))}
            </ListGroup> : "All"}
          </Well> : null}
          <HelpBlock>Relationship Types to include in the query (defaults to all)</HelpBlock>
        </FormGroup>
        <RelationshipTypePicker 
          selectedRelationshipTypes={this.props.selectedRelationshipTypes}
          onAdd={this.props.onAddRelationshipType}
          onRemove={this.props.onRemoveRelationshipType}
          onClose={this.onCloseRelationshipTypePicker}
          show={this.state.showRelationshipTypePicker}
        />
      </React.Fragment>
    );
  }

  private onShowRelationshipTypePicker = (event: any) => {
    this.setState({ showRelationshipTypePicker: true });
  };

  private onCloseRelationshipTypePicker = () => {
    this.setState({ showRelationshipTypePicker: false });
  }

  private onSelectAll = () => {
    // TODO: Implement this
  }
  private onRemoveRelationshipType = (relationshipType: RelationshipType, event: any) => {
    this.props.onRemoveRelationshipType(relationshipType);
  }
}
