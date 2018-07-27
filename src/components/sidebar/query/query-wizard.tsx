import { List } from "immutable";
import * as React from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Panel
} from "react-bootstrap";
import { Diagram, Element, IQuery, Model, Query, RelationshipType, Viewpoints } from "../../../archimate-model";
import CollapsibleFormGroup from "./collapsible-form-group";
import QueryElementsForm from "./query-elements-form";
import RelationshipTypeFilterForm from "./relationship-type-filter-form";

interface IProps {
  elements: List<Element>;
  model: Model;
  relationshipTypes: List<RelationshipType>;
  selectedDiagram: Diagram | undefined;
  query: IQuery;
  onQueryChanged: (query: IQuery) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
  onAddRelationshipType: (relationshipType: RelationshipType) => void;
  onRemoveRelationshipType: (relationshipType: RelationshipType) => void;
}

export default class QueryWizard extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel defaultExpanded={true}>
        <Panel.Heading>
          <Panel.Title componentClass="h3" toggle={true}>Query Wizard</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Form>
              <FormGroup controlId="queryName">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  componentClass="text"
                  placeholder="Query Name"
                  onChange={this.onQueryNameChanged}
                >
                  {this.props.query.name}
                </FormControl>
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
                badge={this.props.query.viewpoint}
                controlId="viewpoint"
                defaultExpanded={false}
                title="Viewpoint">
                <FormControl
                  componentClass="select"
                  defaultValue={this.props.query.viewpoint}
                  onChange={this.onViewpointChanged}
                >
                  {Viewpoints.map(v => <option key={v} value={v}>{v}</option>)}
                </FormControl>
                <FormControl.Feedback />
                <HelpBlock>Filters the valid elements and relationships for the query results</HelpBlock>
              </CollapsibleFormGroup>
              <RelationshipTypeFilterForm
                selectedRelationshipTypes={this.props.relationshipTypes}
                onAddRelationshipType={this.props.onAddRelationshipType}
                onRemoveRelationshipType={this.props.onRemoveRelationshipType}
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
    this.setState({ name: event.target.value });
  };

  private onPathDepthChanged = (event: any) => {
    this.setState({ pathDepth: Number.parseInt(event.target.value, 10) });
  };

  private onViewpointChanged = (event: any) => {
    const viewpoint = event.target.value;
    this.setState({ viewpoint });
    const updatedQuery = Object.assign(new Query(this.props.query.model), this.props.query, {viewpoint});
    this.props.onQueryChanged(updatedQuery);
  };

  private onQueryChanged = (query: IQuery) => {
    this.props.onQueryChanged(query);
  }
}
