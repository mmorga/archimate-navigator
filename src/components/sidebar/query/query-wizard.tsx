import { List } from "immutable";
import * as React from "react";
import {
  Button,
  Checkbox,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Glyphicon,
  ListGroup,
  ListGroupItem,
  Panel
} from "react-bootstrap";
import { Diagram, Element, IQuery, Model, Viewpoints } from "../../../archimate-model";
import QueryElementsForm from "./query-elements-form";

interface IProps {
  elements: List<Element>;
  model: Model;
  selectedDiagram: Diagram | undefined;
  query: IQuery;
  onQueryChanged: (query: IQuery) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
}

export default class QueryWizard extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel>
        <Panel.Heading>Query Wizard</Panel.Heading>
        <Panel.Body>
          <Form>
            <FormGroup controlId="queryName">
              <ControlLabel>Query Name</ControlLabel>
              <FormControl
                componentClass="text"
                placeholder="Query Name"
                onChange={this.onQueryNameChanged}
              >
                {this.props.query.name}
              </FormControl>
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="viewpoint">
              <ControlLabel>Viewpoint</ControlLabel>
              <FormControl
                componentClass="select"
                defaultValue={this.props.query.viewpoint}
                onChange={this.onViewpointChanged}
              >
                {Viewpoints.map(v => <option key={v} value={v}>{v}</option>)}
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
            <FormGroup controlId="relationships">
              <ControlLabel>Relationships</ControlLabel>
              <ListGroup>
                {this.props.query.relationships.map(el => (el ? 
                  <ListGroupItem key={el.id}>
                    <div className="pull-right">
                      <Button bsSize="xsmall" bsStyle="danger">
                        <Glyphicon glyph="remove" />
                      </Button>
                    </div>
                    <span className="text-info">{el.type}</span>{": "}
                    {<span className="text-primary">{el.name}</span> || <span className="text-muted">unnamed</span>}
                  </ListGroupItem> : undefined
                ))}
              </ListGroup>
              <Button bsSize="xsmall">
                <Glyphicon glyph="add" /> Add...
              </Button>
              <Checkbox>Include Derived Relationships</Checkbox>
            </FormGroup>
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
    this.setState({ viewpoint: event.target.value });
  };

  private onQueryChanged = (query: IQuery) => {
    this.props.onQueryChanged(query);
  }
}
