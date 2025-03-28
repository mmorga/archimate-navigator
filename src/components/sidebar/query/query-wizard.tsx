import Fuse from "fuse.js";
import { List, Set } from "immutable";
import * as React from "react";
import { useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Collapse,
  Form,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
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
  Viewpoints,
  ViewpointType,
} from "../../../archimate-model";
import ElementTypeFilter from "./query-wizard-form/element-type-filter";

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

export default function QueryWizard({ query, onQueryChanged }: IProps) {
  // const [elementTypeFilter] = useState<ElementTypeFilterType>("All");
  // const [elementTypeFilterCollapsed, setElementTypeFilterCollapsed] = useState(true);
  const [fuse, setFuse] = useState<Fuse<FuseElement>>();
  // const [fuseElementTypes, setFuseElementTypes] = useState<Set<ElementType>>();
  // const [fuseFilteredElements, setFuseFilteredElements] = useState<Set<Element>>();
  const [layerFilterCollapsed, setLayerFilterCollapsed] = useState(true);
  const [results, setResults] = useState<List<Element>>(List());
  const [search, setSearch] = useState("");

  const fuseOptions = {
    distance: 100,
    keys: ["name", "type"],
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.6,
  };

  const onQueryNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChanged(query.updateQuery({ name: event.target.value }));
  };

  const onViewpointChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const viewpointType = event.target.value as ViewpointType;
    onQueryChanged(
      query.updateQuery({
        elementTypes: Set<ElementType>(
          elementTypesForViewpoint(viewpointType, query.elementTypes),
        ),
        viewpointType,
      }),
    );
  };

  const onPathDepthChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChanged(
      query.updateQuery({
        pathDepth: Number.parseInt(event.target.value, 10),
      }),
    );
  };

  const onLayerFilterChanged = (layer: Layer, checked: boolean) => {
    let layerFilter;
    if (checked) {
      layerFilter = query.layerFilter.add(layer);
    } else {
      layerFilter = query.layerFilter.remove(layer);
    }
    onQueryChanged(query.updateQuery({ layerFilter }));
  };

  const layerChecked = (layer: Layer): boolean => {
    return query.layerFilter.includes(layer);
  };

  const onAddClick = (element: Element) => {
    onQueryChanged(
      query.updateQuery({
        elements: query.elements.add(element),
      }),
    );
  };

  const onRemoveClick = (element: Element) => {
    onQueryChanged(
      query.updateQuery({
        elements: query.elements.remove(element),
      }),
    );
  };

  const addRemoveElement = (el: Element) => {
    const isSelected = query.elements.some((e) => (e ? e.id === el.id : false));
    const onClick = isSelected ? () => onRemoveClick(el) : () => onAddClick(el);
    const variant = isSelected ? "danger" : "primary";
    return (
      <Button size="sm" variant={variant} onClick={onClick}>
        {isSelected ? <Trash /> : <Plus />}
      </Button>
    );
  };

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    calculateResults(event.target.value);
  };

  const calculateResults = (searchValue: string) => {
    if (fuse === undefined) {
      const newFuseElementTypes = query.elementTypes;
      const newFuseFilteredElements = Set<Element>(
        allElements().filter((e) =>
          e ? newFuseElementTypes.some((et) => et === e.type) : false,
        ),
      );
      // setFuseElementTypes(newFuseElementTypes);
      // setFuseFilteredElements(newFuseFilteredElements);

      const newFuse = new Fuse<FuseElement>(
        newFuseFilteredElements.toJS().map((el) => ({
          id: el.id,
          type: el.type,
          name: el.name,
          documentation: el.documentation,
        })),
        fuseOptions,
      );
      setFuse(newFuse);
    }

    const newResults: List<Element> =
      searchValue.length > 0
        ? List<Element>(
            (fuse as Fuse<FuseElement>)
              .search(searchValue)
              .map((result) =>
                query.model.elements.find((el) => el.id === result.item.id),
              )
              .filter((el): el is Element => el !== undefined),
          )
        : List<Element>();
    setResults(newResults);
  };

  const allElements = () => {
    return List<Element>(query.model.elements);
  };

  const onLayerFilterCollapse = () => {
    setLayerFilterCollapsed(!layerFilterCollapsed);
  };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Query Wizard</Accordion.Header>
        <Accordion.Body>
          <Form>
            <FormGroup controlId="queryName">
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={query.name}
                placeholder="Query Name"
                onChange={onQueryNameChanged}
              />
            </FormGroup>
            <FormGroup controlId="viewpointType">
              <Form.Label>Viewpoint</Form.Label>
              <Form.Select
                onChange={onViewpointChanged}
                value={query.viewpointType}
              >
                {Viewpoints.map((v) => v)
                  .sort()
                  .map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
              </Form.Select>
            </FormGroup>
            <FormGroup>
              <div className="form-label">
                Layer Filter
                {"  "}
                {layerFilterCollapsed ? (
                  <CaretUpFill onClick={onLayerFilterCollapse} />
                ) : (
                  <CaretDownFill onClick={onLayerFilterCollapse} />
                )}
              </div>
              <Collapse in={!layerFilterCollapsed}>
                <Card body className="small">
                  <div style={{ columns: 2 }}>
                    {DisplayLayers.map((layer) => (
                      <Form.Check
                        key={layer}
                        id={layer}
                        checked={layerChecked(layer)}
                        onChange={() => {
                          onLayerFilterChanged(layer, !layerChecked(layer));
                        }}
                        label={layer}
                      />
                    ))}
                  </div>
                </Card>
              </Collapse>
            </FormGroup>
            <ElementTypeFilter query={query} onQueryChanged={onQueryChanged} />
            <FormGroup>
              <Form.Label htmlFor="pathDepth">Max Path Depth</Form.Label>
              <FormControl
                id="pathDepth"
                type="number"
                min="0"
                max="100"
                step="1"
                value={query.pathDepth}
                onChange={onPathDepthChanged}
              />
              <Form.Text muted>
                Maximum number of connections to include
              </Form.Text>
            </FormGroup>
            <FormGroup controlId="search">
              <Form.Label>Search</Form.Label>
              <input
                type="text"
                value={search}
                className="form-control"
                id="search"
                placeholder="search"
                onChange={onSearchChanged}
              />
            </FormGroup>
            <FormGroup>
              <div className="form-label">
                Results <Badge>{results.size}</Badge>
              </div>
              <ListGroup id="results">
                {results
                  .toArray()
                  .slice(0, Math.min(20, results.size))
                  .map((el) =>
                    el ? (
                      <ListGroupItem key={el.id}>
                        <div className="pull-right">{addRemoveElement(el)}</div>
                        <span className="text-info">{el.type}</span>
                        {": "}
                        {el.name ? (
                          <span className="text-primary">{el.name}</span>
                        ) : (
                          <span className="text-muted">unnamed</span>
                        )}
                      </ListGroupItem>
                    ) : undefined,
                  )}
              </ListGroup>
            </FormGroup>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
