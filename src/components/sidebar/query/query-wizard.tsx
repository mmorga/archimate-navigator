import { List, Set } from "immutable";
import * as React from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Panel
} from "react-bootstrap";
import {
  Diagram,
  Element,
  Model,
  Query,
  RelationshipType,
  Viewpoints
} from "../../../archimate-model";
import CollapsibleFormGroup from "./collapsible-form-group";
import QueryElementsForm from "./query-elements-form";
import RelationshipTypeFilterForm from "./relationship-type-filter-form";

interface IProps {
  elements: List<Element>;
  model: Model;
  selectedDiagram: Diagram | undefined;
  query: Query;
  onQueryChanged: (query: Query) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
}

export default class QueryWizard extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel defaultExpanded={true}>
        <Panel.Heading>
          <Panel.Title componentClass="h3" toggle={true}>
            Query Wizard
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Form>
              <FormGroup controlId="queryName">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.query.name}
                  placeholder="Query Name"
                  onChange={this.onQueryNameChanged}
                />
                <FormControl.Feedback />
              </FormGroup>
              <QueryElementsForm
                allElements={List<Element>(this.props.model.elements)}
                selectedElements={this.props.elements}
                onAddElement={this.props.onAddElement}
                onRemoveElement={this.props.onRemoveElement}
                onQueryChanged={this.onQueryChanged}
              />
              <CollapsibleFormGroup
                label={this.props.query.viewpoint}
                controlId="viewpoint"
                defaultExpanded={false}
                title="Viewpoint"
              >
                <FormControl
                  componentClass="select"
                  defaultValue={this.props.query.viewpoint}
                  onChange={this.onViewpointChanged}
                >
                  {Viewpoints.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </FormControl>
                <FormControl.Feedback />
                <HelpBlock>
                  Filters the valid elements and relationships for the query
                  results
                </HelpBlock>
              </CollapsibleFormGroup>
              <RelationshipTypeFilterForm
                selectedRelationshipTypes={this.props.query.relationshipTypes}
                onChange={this.onChangeRelationshipTypes}
              />
              <FormGroup controlId="options">
                <ControlLabel>Path Depth</ControlLabel>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={this.props.query.pathDepth}
                  onChange={this.onPathDepthChanged}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Form>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  private onQueryNameChanged = (event: any) => {
    this.props.onQueryChanged(this.updateQuery({ name: event.target.value }));
  };

  private onPathDepthChanged = (event: any) => {
    this.props.onQueryChanged(this.updateQuery({ pathDepth: Number.parseInt(event.target.value, 10) }));
  };

  private onViewpointChanged = (event: any) => {
    this.props.onQueryChanged(this.updateQuery({viewpoint: event.target.value}));
  };

  private onChangeRelationshipTypes = (
    relationshipTypes: Set<RelationshipType>
  ) => {
    this.props.onQueryChanged(this.updateQuery({relationshipTypes}));
  };

  private onQueryChanged = (query: Query) => {
    this.props.onQueryChanged(query);
  };

  private updateQuery(update: any): Query {
    return Object.assign(
      new Query(this.props.query.model),
      this.props.query,
      update
    );
  }
}
