import Fuse from "fuse.js";
import { List, Set } from "immutable";
import * as React from "react";
import {
  Badge,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  Panel,
  Well
} from "react-bootstrap";
import {
  Diagram,
  DisplayLayers,
  Element,
  ElementType,
  Layer,
  Model,
  Query,
  Viewpoints
} from "../../../archimate-model";
import ElementTypeFilter from "./element-type-filter";
import LayerCheckbox from "./query-wizard-form/layer-checkbox";

type ElementTypeFilterType = ElementType | string;

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  elementTypeFilter: ElementTypeFilterType;
  elementTypeFilterCollapsed: boolean;
  fuse?: Fuse;
  fuseElementTypes?: Set<ElementType>;
  fuseFilteredElements?: Set<Element>;
  layerFilterCollapsed: boolean;
  results: List<Element>;
  search: string;
}

export default class QueryWizard extends React.PureComponent<IProps, IState> {
  private fuseOptions = {
    distance: 100,
    keys: ["name", "type"],
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.6
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      elementTypeFilter: "All",
      elementTypeFilterCollapsed: true,
      layerFilterCollapsed: true,
      results: List(),
      search: ""
    };
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
              </FormGroup>
              <FormGroup controlId="viewpointType">
                <ControlLabel>Viewpoint</ControlLabel>
                <FormControl
                  componentClass="select"
                  defaultValue={this.props.query.viewpointType}
                  onChange={this.onViewpointChanged}
                >
                  {Viewpoints.sort().map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="layerFilter">
                <ControlLabel>
                  Layer Filter
                  {"  "}
                  <Glyphicon glyph={this.state.layerFilterCollapsed ? "collapse-up" : "collapse-down"} onClick={this.onLayerFilterCollapse}/>
                </ControlLabel>
                {this.state.layerFilterCollapsed ? null : (
                  <Well bsSize="small">
                    <div style={{columns: 2}}>
                      {DisplayLayers.map(layer => 
                        (<LayerCheckbox layer={layer} checked={this.layerChecked(layer)} onChange={this.onLayerFilterChanged}/>))
                      }
                    </div>
                  </Well>
                ) }
              </FormGroup>
              <ElementTypeFilter
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <FormGroup>
                <ControlLabel>Max Path Depth</ControlLabel>
                <FormControl
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={this.props.query.pathDepth}
                  onChange={this.onPathDepthChanged}
                />
                <HelpBlock>Maximum number of connections to include</HelpBlock>
              </FormGroup>
              <FormGroup controlId="search">
                <ControlLabel>Search</ControlLabel>
                <input
                  type="text"
                  value={this.state.search}
                  className="form-control"
                  id="search"
                  placeholder="search"
                  onChange={this.onSearchChanged}
                />
              </FormGroup>
              <FormGroup controlId="results">
                <ControlLabel>
                  Results <Badge>{this.state.results.size}</Badge>
                </ControlLabel>
                <ListGroup>
                  {this.state.results
                    .slice(0, Math.min(20, this.state.results.size))
                    .map(
                      el =>
                        el ? (
                          <ListGroupItem key={el.id}>
                            <div className="pull-right">
                              {this.addRemoveElement(el)}
                            </div>
                            <span className="text-info">{el.type}</span>
                            {": "}
                            {<span className="text-primary">{el.name}</span> || (
                              <span className="text-muted">unnamed</span>
                            )}
                          </ListGroupItem>
                        ) : (
                          undefined
                        )
                    )}
                </ListGroup>
              </FormGroup>
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

  private onViewpointChanged = (event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({ viewpointType: event.target.value })
    );
  };

  private onPathDepthChanged = (event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        pathDepth: Number.parseInt(event.target.value, 10)
      })
    );
  };

  private onLayerFilterChanged = (layer: Layer, checked: boolean) => {
    let layerFilter;
    if (checked) {
      layerFilter = this.props.query.layerFilter.add(layer);
    } else {
      layerFilter = this.props.query.layerFilter.remove(layer);
    }
    this.props.onQueryChanged(this.props.query.updateQuery({ layerFilter }));
  }

  private layerChecked(layer: Layer): boolean {
    return this.props.query.layerFilter.includes(layer);
  }

  private onAddClick = (element: Element, event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elements: this.props.query.elements.add(element)
      })
    );
  }

  private onRemoveClick = (element: Element, event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elements: this.props.query.elements.remove(element)
      })
    );
  }

  private addRemoveElement(el: Element): JSX.Element {
    // TODO: should be working with Immutable v4
    // const isSelected = this.props.selectedElements.includes(el);
    const isSelected = this.props.query.elements.some(
      e => (e ? e.id === el.id : false)
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

  private onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: event.target.value });
    this.calculateResults();
  };

  private calculateResults() {
    if (this.state.fuse === undefined) {
      const fuseElementTypes = this.props.query.elementTypes;
      const fuseFilteredElements = Set<Element>(
        this.allElements().filter(
          e => (e ? fuseElementTypes.some(et => et === e.type) : false)
        )
      );
      this.setState({
        fuseElementTypes,
        fuseFilteredElements
      });
      const fuse = new Fuse(fuseFilteredElements.toJS(), this.fuseOptions);
      this.setState({ fuse });
    }
    const results: List<Element> =
      this.state.search.length > 0
        ? List<Element>((this.state.fuse as Fuse).search(this.state.search))
        : List<Element>();
    this.setState({ results });
  }

  private allElements = () => {
    return List<Element>(this.props.query.model.elements);
  };

  private onLayerFilterCollapse = () => {
    this.setState({layerFilterCollapsed: !this.state.layerFilterCollapsed});
  }
}
