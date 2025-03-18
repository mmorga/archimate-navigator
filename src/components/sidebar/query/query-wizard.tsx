import Fuse from "fuse.js";
import { List, Set } from "immutable";
import * as React from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Form,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import { CaretUpFill, CaretDownFill, Plus, Trash } from "react-bootstrap-icons";
import {
  Diagram,
  DisplayLayers,
  Element,
  ElementType,
  elementTypesForViewpoint,
  Layer,
  Model,
  Query,
  Viewpoints
} from "../../../archimate-model";
import ElementTypeFilter from "./query-wizard-form/element-type-filter";
import LayerCheckbox from "./query-wizard-form/layer-checkbox";
import { JSX } from "react";

type ElementTypeFilterType = ElementType | string;

interface FuseElement {
  id: string;
  type: ElementType;
  name: string;
  documentation?: string;
}

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
  query: Query;
  onQueryChanged: (query: Query) => void;
}

interface IState {
  elementTypeFilter: ElementTypeFilterType;
  elementTypeFilterCollapsed: boolean;
  fuse?: Fuse<FuseElement>;
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
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Query Wizard
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <FormGroup controlId="queryName">
                <Form.Label>Name</Form.Label>
                <FormControl
                  type="text"
                  value={this.props.query.name}
                  placeholder="Query Name"
                  onChange={this.onQueryNameChanged}
                />
              </FormGroup>
              <FormGroup controlId="viewpointType">
                <Form.Label>Viewpoint</Form.Label>
                <FormControl
                  as="select"
                  onChange={this.onViewpointChanged}
                  value={this.props.query.viewpointType}
                >
                  {Viewpoints.map(v => v).sort().map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="layerFilter">
                <Form.Label>
                  Layer Filter
                  {"  "}
                  {this.state.layerFilterCollapsed ? <CaretUpFill onClick={this.onLayerFilterCollapse}/> : <CaretDownFill onClick={this.onLayerFilterCollapse}/>}
                </Form.Label>
                {this.state.layerFilterCollapsed ? null : (
                  <Card body className="small">
                    <div style={{columns: 2}}>
                      {DisplayLayers.map(layer => 
                        (<LayerCheckbox layer={layer} checked={this.layerChecked(layer)} onChange={this.onLayerFilterChanged}/>))
                      }
                    </div>
                  </Card>
                ) }
              </FormGroup>
              <ElementTypeFilter
                query={this.props.query}
                onQueryChanged={this.props.onQueryChanged}
              />
              <FormGroup>
                <Form.Label>Max Path Depth</Form.Label>
                <FormControl
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={this.props.query.pathDepth}
                  onChange={this.onPathDepthChanged}
                />
                <Form.Text muted>Maximum number of connections to include</Form.Text>
              </FormGroup>
              <FormGroup controlId="search">
                <Form.Label>Search</Form.Label>
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
                <Form.Label>
                  Results <Badge>{this.state.results.size}</Badge>
                </Form.Label>
                <ListGroup>
                  {this.state.results
                    .toArray()
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
                            {el.name ? (
                              <span className="text-primary">{el.name}</span>
                            ) : (
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  private onQueryNameChanged = (event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({ name: event.target.value })
    );
  };

  private onViewpointChanged = (event: any) => {
    const viewpointType = event.target.value;
    this.props.onQueryChanged(
      this.props.query.updateQuery({ 
        elementTypes: Set<ElementType>(elementTypesForViewpoint(viewpointType, this.props.query.elementTypes)),
        viewpointType,
      })
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

  private onAddClick = (element: Element, _event: any) => {
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elements: this.props.query.elements.add(element)
      })
    );
  }

  private onRemoveClick = (element: Element, _event: any) => {
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
      const fuse = new Fuse<FuseElement>(
        fuseFilteredElements.toJS().map(el => ({
          id: el.id,
          type: el.type,
          name: el.name,
          documentation: el.documentation
        })),
        this.fuseOptions
      );
      this.setState({ fuse });
    }
    const results: List<Element> =
      this.state.search.length > 0
        ? List<Element>(
            (this.state.fuse as Fuse<FuseElement>)
              .search(this.state.search)
              .map(result => this.props.query.model.elements.find(el => el.id === result.item.id))
              .filter((el): el is Element => el !== undefined)
          )
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
