import * as React from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Panel
} from "react-bootstrap";
import { Diagram, Model, Query } from "../../../archimate-model";
import ElementTypeFilterPanel from "./element-type-filter-panel";
import ElementsPanel from "./elements-panel";
import OptionsPanel from "./options-panel";
import RelationshipTypeFilterPanel from "./relationship-type-filter-panel";
import ViewpointPanel from "./viewpoint-panel";

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
  query: Query;
  onQueryChanged: (query: Query) => void;
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
              <ElementsPanel
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <ViewpointPanel
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <ElementTypeFilterPanel
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <RelationshipTypeFilterPanel
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <OptionsPanel
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
            </Form>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  private onQueryNameChanged = (event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({ name: event.target.value })
    );
  };
}
