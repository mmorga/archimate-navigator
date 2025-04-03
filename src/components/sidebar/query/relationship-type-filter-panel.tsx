import { Set } from "immutable";
import { JSX, useCallback, useEffect, useState } from "react";
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
  updateQuery,
} from "../../../archimate-model";
import CollapsibleFormGroup, {
  ValidationState,
} from "./collapsible-form-group";

type IProps = {
  query: Query;
  onQueryChanged: (query: Query) => void;
};

export default function RelationshipTypeFilterPanel({
  query,
  onQueryChanged,
}: IProps) {
  const [validationState, setValidationState] =
    useState<ValidationState>("error");
  const [prevQuery, setPrevQuery] = useState(query);

  const calcValidationState = useCallback((): ValidationState => {
    if (query.relationshipTypes.size === 0) {
      return "error";
    } else {
      return null;
    }
  }, [query.relationshipTypes]);

  useEffect(() => {
    if (query.relationshipTypes !== prevQuery.relationshipTypes) {
      setValidationState(calcValidationState());
      setPrevQuery(query);
    }
  }, [calcValidationState, prevQuery.relationshipTypes, query]);

  const onSelectAll = () => {
    onQueryChanged(
      updateQuery(query.model, query, {
        relationshipTypes: Set<RelationshipType>(RelationshipTypes),
      }),
    );
  };

  const onSelectNone = () => {
    onQueryChanged(
      updateQuery(query.model, query, {
        relationshipTypes: Set<RelationshipType>(),
      }),
    );
  };

  const onAddClick = (relationshipType: RelationshipType) => {
    onQueryChanged(
      updateQuery(query.model, query, {
        relationshipTypes: query.relationshipTypes.add(relationshipType),
      }),
    );
  };

  const onRemoveClick = (relationshipType: RelationshipType) => {
    onQueryChanged(
      updateQuery(query.model, query, {
        relationshipTypes: query.relationshipTypes.remove(relationshipType),
      }),
    );
  };

  const onDerivedRelationsToggle = () => {
    onQueryChanged(
      updateQuery(query.model, query, {
        includeDerivedRelations: !query.includeDerivedRelations,
      }),
    );
  };

  function addRemoveRelationshipType(el: RelationshipType): JSX.Element {
    // TODO: should be working with Immutable v4
    // const isSelected = query.relationshipTypes.includes(el);
    const isSelected = query.relationshipTypes.some((e) =>
      e ? e === el : false,
    );
    const onClick = isSelected ? onRemoveClick : onAddClick;
    const bsStyle = isSelected ? "danger" : "primary";
    return (
      <Button size="sm" variant={bsStyle} onClick={() => onClick(el)}>
        {isSelected ? <Trash /> : <Plus />}
      </Button>
    );
  }

  function label() {
    const count = query.relationshipTypes.size;
    switch (count) {
      case RelationshipTypes.length:
        return "All";
      case 0:
        return "Pick one+";
      default:
        return count.toString(10);
    }
  }

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
      label={label()}
      labelStyle={query.relationshipTypes.size === 0 ? "danger" : "info"}
      defaultExpanded={false}
      title="Relationship Types Filter"
      validationState={validationState}
    >
      <FormGroup>
        <Form.Check
          type="checkbox"
          onChange={onDerivedRelationsToggle}
          label="Include Derived Relations"
        />
      </FormGroup>

      <ButtonGroup>
        <OverlayTrigger placement="top" overlay={allTooltip}>
          <Button onClick={onSelectAll}>All</Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={noneTooltip}>
          <Button onClick={onSelectNone}>None</Button>
        </OverlayTrigger>
      </ButtonGroup>
      <ListGroup>
        {RelationshipTypes.sort().map((el) =>
          el ? (
            <ListGroupItem key={el}>
              <div className="pull-right">{addRemoveRelationshipType(el)}</div>
              {<span className="text-primary">{el}</span>}
            </ListGroupItem>
          ) : undefined,
        )}
      </ListGroup>
      <Form.Text muted>Relationship Types to include in the query</Form.Text>
    </CollapsibleFormGroup>
  );
}
