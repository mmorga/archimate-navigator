import { Set } from "immutable";
import * as React from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Panel,
  PanelGroup
} from "react-bootstrap";
import {
  Diagram,
  Model,
  Query,
  RelationshipType,
} from "../../../archimate-model";
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

enum WizardPanelGroup {
  Elements = "1",
  Viewpoint = "2",
  ElementType = "3",
  RelationshipType = "4",
  Options = "5",
}

interface IState {
  activeKey: WizardPanelGroup;
}

export default class QueryWizard extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeKey: WizardPanelGroup.Elements,
    }
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
              <PanelGroup 
                  accordion={true} 
                  id="query-panel-group"
                  activeKey={this.state.activeKey}
                  onSelect={this.handleSelect}>
                <ElementsPanel
                  eventKey={WizardPanelGroup.Elements}
                  expanded={this.state.activeKey === WizardPanelGroup.Elements}
                  query={this.props.query}
                  onQueryChanged={this.props.onQueryChanged} />
                <ViewpointPanel
                  eventKey={WizardPanelGroup.Viewpoint}
                  expanded={this.state.activeKey === WizardPanelGroup.Viewpoint}
                  query={this.props.query}
                  onQueryChanged={this.props.onQueryChanged} />
                <ElementTypeFilterPanel
                  eventKey={WizardPanelGroup.ElementType}
                  expanded={this.state.activeKey === WizardPanelGroup.ElementType}
                  query={this.props.query}
                  onQueryChanged={this.props.onQueryChanged} />
                <RelationshipTypeFilterPanel
                  eventKey={WizardPanelGroup.RelationshipType}
                  expanded={this.state.activeKey === WizardPanelGroup.RelationshipType}
                  selectedRelationshipTypes={this.props.query.relationshipTypes}
                  onChange={this.onChangeRelationshipTypes} />
                <OptionsPanel
                  eventKey={WizardPanelGroup.Options}
                  expanded={this.state.activeKey === WizardPanelGroup.Options}
                  query={this.props.query}
                  onQueryChanged={this.props.onQueryChanged} />
              </PanelGroup>
            </Form>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  private onQueryNameChanged = (event: any) => {
    this.props.onQueryChanged(this.props.query.updateQuery({ name: event.target.value }));
  };

  private onChangeRelationshipTypes = (
    relationshipTypes: Set<RelationshipType>
  ) => {
    this.props.onQueryChanged(this.props.query.updateQuery({relationshipTypes}));
  };

  private handleSelect(activeKey: any) {
    this.setState({ activeKey });
  }
}
