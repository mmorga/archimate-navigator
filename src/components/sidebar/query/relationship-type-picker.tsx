import { List } from "immutable";
import * as React from "react";
import {
  Button,
  ControlLabel,
  Form,
  FormGroup,
  Glyphicon,
  ListGroup,
  ListGroupItem,
  Modal
} from "react-bootstrap";
import {
  RelationshipType,
  RelationshipTypes,
} from "../../../archimate-model";

interface IProps {
  selectedRelationshipTypes: List<RelationshipType>;
  onAdd: (relationshipType: RelationshipType) => void;
  onRemove: (relationshipType: RelationshipType) => void;
  onClose: () => void;
  show: boolean;
}

interface IState {
  search: string;
}

export default class RelationshipTypePicker extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      search: ""
    };
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.onClose}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Filter by ArchiMate Relationship Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup controlId="elementTypeFilter">
              <ControlLabel>RelationshipType Type Filter</ControlLabel>
              <ListGroup>
                {RelationshipTypes
                  .map(el => (el ?
                    <ListGroupItem key={el}>
                      <div className="pull-right">
                        {this.addRemoveRelationshipType(el)}
                      </div>
                      {<span className="text-primary">{el}</span>}
                  </ListGroupItem> : undefined
                ))}
            </ListGroup>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private onAddClick = (relationshipType: RelationshipType, event: any) => {
    this.props.onAdd(relationshipType);
  };

  private onRemoveClick = (relationshipType: RelationshipType, event: any) => {
    this.props.onRemove(relationshipType);
    // TODO: Add check to ensure at least one relationship is selected.
  };

  private onClose = (event: any) => {
    this.props.onClose();
  };

  private addRemoveRelationshipType(el: RelationshipType): JSX.Element {
    // TODO: should be working with Immutable v4 
    // const isSelected = this.props.selectedRelationshipTypes.includes(el);
    const isSelected = this.props.selectedRelationshipTypes.some(e => e ? e === el : false);
    const glyph = isSelected ? "remove" : "plus";
    const onClick = isSelected ? this.onRemoveClick.bind(this, el): this.onAddClick.bind(this, el);
    const bsStyle = isSelected ? "danger" : "primary";
    return (
      <Button
        bsSize="xsmall"
        bsStyle={bsStyle}
        onClick={onClick}
      >
        <Glyphicon glyph={glyph} />
      </Button>
    );
  }
}
