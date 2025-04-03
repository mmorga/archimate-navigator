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
  Layer,
  Model,
  Query,
  Viewpoints,
  ViewpointType,
} from "../../../archimate-model";
import { List, Set } from "immutable";
import { ChangeEvent, useState } from "react";
import ElementTypeFilter from "./query-wizard-form/element-type-filter";
import Fuse from "fuse.js";

type FuseElement = {
  id: string;
  type: ElementType;
  name: string;
  documentation?: string;
};

export default function QueryWizard({
  model,
  query,
  onQueryNameChanged,
  onViewpointChanged,
  onPathDepthChanged,
  onLayerFilterChanged,
  onElementTypeFilterChanged,
  onAddElement,
  onRemoveElement,
}: {
  model: Model | undefined;
  selectedDiagram: Diagram | undefined;
  query: Query | undefined;
  onQueryNameChanged: (name: string) => void;
  onViewpointChanged: (viewpointType: ViewpointType) => void;
  onPathDepthChanged: (depth: number) => void;
  onLayerFilterChanged: (layer: Layer, checked: boolean) => void;
  onElementTypeFilterChanged: (elementType: ElementType) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
}) {
  const [layerFilterCollapsed, setLayerFilterCollapsed] = useState(true);
  const [results, setResults] = useState<List<Element>>(List());
  const [search, setSearch] = useState("");

  const layerChecked = (layer: Layer): boolean => {
    return query ? query.layerFilter.includes(layer) : false;
  };

  const addRemoveElement = (el: Element) => {
    if (query) {
      const isSelected = query.elements.some((e) =>
        e ? e.id === el.id : false,
      );
      const onClick = isSelected
        ? () => onRemoveElement(el)
        : () => onAddElement(el);
      const variant = isSelected ? "danger" : "primary";
      return (
        <Button size="sm" variant={variant} onClick={onClick}>
          {isSelected ? <Trash /> : <Plus />}
        </Button>
      );
    }
  };

  const onSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    calculateResults(event.target.value);
  };

  function fuseObj() {
    if (query === undefined || model === undefined) {
      return undefined;
    }
    const fuseOptions = {
      distance: 100,
      keys: ["name", "type"],
      location: 0,
      maxPatternLength: 32,
      shouldSort: true,
      threshold: 0.6,
    };

    const newFuseFilteredElements = Set<Element>(
      List<Element>(model.elements).filter((e) =>
        e ? query.elementTypes.some((et) => et === e.type) : false,
      ),
    );

    const newFuse = new Fuse<FuseElement>(
      newFuseFilteredElements.toJS().map((el) => ({
        id: el.id,
        type: el.type,
        name: el.name,
        documentation: el.documentation,
      })),
      fuseOptions,
    );
    return newFuse;
  }

  const calculateResults = (searchValue: string) => {
    const fuse = fuseObj();
    let newResults: List<Element> = List();
    if (fuse && model && searchValue.length > 0) {
      newResults = List<Element>(
        fuse
          .search(searchValue)
          .map((result) =>
            model.elements.find((el) => el.id === result.item.id),
          )
          .filter((el): el is Element => el !== undefined),
      );
    }
    setResults(newResults);
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
                value={query ? query.name : ""}
                placeholder="Query Name"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onQueryNameChanged(event.target.value)
                }
              />
            </FormGroup>
            <FormGroup controlId="viewpointType">
              <Form.Label>Viewpoint</Form.Label>
              <Form.Select
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onViewpointChanged(event.target.value as ViewpointType)
                }
                value={query ? query.viewpointType : ""}
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
            <ElementTypeFilter
              query={query}
              onChanged={onElementTypeFilterChanged}
            />
            <FormGroup>
              <Form.Label htmlFor="pathDepth">Max Path Depth</Form.Label>
              <FormControl
                id="pathDepth"
                type="number"
                min="0"
                max="100"
                step="1"
                value={query ? query.pathDepth : 0}
                onChange={(event) =>
                  onPathDepthChanged(Number.parseInt(event.target.value, 10))
                }
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
              <ListGroup id="results" variant="flush">
                {results
                  .toArray()
                  .slice(0, Math.min(20, results.size))
                  .map((el) =>
                    el ? (
                      <ListGroupItem key={el.id}>
                        <div className="pull-right" style={{ float: "right" }}>
                          {addRemoveElement(el)}
                        </div>
                        {el.name ? (
                          <span
                            className="text-primary"
                            style={{ fontSize: "85%" }}
                          >
                            {el.name}
                          </span>
                        ) : (
                          <span
                            className="text-muted"
                            style={{ fontSize: "85%" }}
                          >
                            unnamed
                          </span>
                        )}
                        <br />
                        <span className="text-info" style={{ fontSize: "75%" }}>
                          &lt;{el.type}&gt;
                        </span>
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
