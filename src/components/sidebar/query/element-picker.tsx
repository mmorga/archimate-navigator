import Fuse from "fuse.js";
import { List } from "immutable";
import * as React from "react";
import { JSX } from "react";
import {
  Badge,
  Button,
  Form,
  FormControl,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import {
  Element,
  ElementType,
  Layer,
  layerElements,
  Layers,
  Query,
} from "../../../archimate-model";

type ElementTypeFilterType = ElementType | string;

interface IProps {
  onChange: (query: Query) => void;
  onClose: () => void;
  query: Query;
  show: boolean;
}

interface FuseElement {
  id: string;
  type: ElementType;
  name: string;
  documentation?: string;
}

const ElementPicker: React.FC<IProps> = (props) => {
  const allLayers = React.useMemo(
    () =>
      new Array<Layer | string>().concat(
        ["All"],
        Layers.filter((l: Layer) => l !== Layer.None),
      ),
    [],
  );

  const fuseOptions = React.useMemo(
    () => ({
      distance: 100,
      keys: ["name", "type"],
      location: 0,
      maxPatternLength: 32,
      shouldSort: true,
      threshold: 0.6,
    }),
    [],
  );

  const elementTypesForLayer = React.useCallback(
    (layer: Layer | string): List<ElementTypeFilterType> => {
      return List<ElementTypeFilterType>(
        layerElements(layer === "All" ? Layer.None : (layer as Layer))
          .map((v) => v)
          .sort(),
      ).unshift("All");
    },
    [],
  );

  const [elementTypeFilter, setElementTypeFilter] =
    React.useState<ElementTypeFilterType>("All");
  const [elementTypesFilterElements, setElementTypesFilterElements] =
    React.useState<List<ElementTypeFilterType>>(
      elementTypesForLayer(Layer.None),
    );
  const [layerFilter, setLayerFilter] = React.useState<Layer | string>("All");
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<List<Element>>(List());
  const [fuse, setFuse] = React.useState<Fuse<FuseElement> | undefined>(
    undefined,
  );

  const filteredElementTypes = React.useCallback((): List<ElementType> => {
    if (elementTypeFilter === "All") {
      return List(
        elementTypesFilterElements
          .filter((et) => et !== "All")
          .map((et) => et as ElementType),
      );
    } else {
      return List([elementTypeFilter as ElementType]);
    }
  }, [elementTypeFilter, elementTypesFilterElements]);

  const allElements = React.useCallback(() => {
    return List<Element>(props.query.model.elements);
  }, [props.query.model.elements]);

  const calculateResults = React.useCallback(() => {
    if (fuse === undefined) {
      const types = filteredElementTypes();
      const filtered = List<Element>(
        allElements().filter((e) =>
          e ? types.some((et) => et === e.type) : false,
        ),
      );
      const newFuse = new Fuse<FuseElement>(
        filtered.toJS().map((el) => ({
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
      search.length > 0 && fuse
        ? List<Element>(
            fuse
              .search(search)
              .map((result) =>
                props.query.model.elements.find(
                  (el) => el.id === result.item.id,
                ),
              )
              .filter((el): el is Element => el !== undefined),
          )
        : List<Element>();
    setResults(newResults);
  }, [
    fuse,
    search,
    filteredElementTypes,
    allElements,
    fuseOptions,
    props.query.model.elements,
  ]);

  React.useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const onSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onAddClick = (element: Element) => {
    props.onChange(
      props.query.updateQuery({
        elements: props.query.elements.add(element),
      }),
    );
  };

  const onRemoveClick = (element: Element) => {
    props.onChange(
      props.query.updateQuery({
        elements: props.query.elements.remove(element),
      }),
    );
  };

  const onLayerFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLayerFilter = event.target.value;
    const types = elementTypesForLayer(newLayerFilter);
    setElementTypesFilterElements(types);
    setFuse(undefined);
    setLayerFilter(newLayerFilter);
    setResults(List<Element>());
  };

  const onElementTypeFilterChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newElementTypeFilter = event.target.value;
    setElementTypeFilter(newElementTypeFilter);
    setFuse(undefined);
    setResults(List<Element>());
  };

  const addRemoveElement = (el: Element): JSX.Element => {
    const isSelected = props.query.elements.some((e) =>
      e ? e.id === el.id : false,
    );
    const bsStyle = isSelected ? "danger" : "primary";
    const onClick = isSelected ? () => onRemoveClick(el) : () => onAddClick(el);
    const icon = isSelected ? <Trash /> : <Plus />;
    return (
      <Button size="sm" variant={bsStyle} onClick={onClick}>
        {icon}
      </Button>
    );
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Add ArchiMate Element</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup controlId="layerFilter">
            <Form.Label>Layer Filter</Form.Label>
            <FormControl
              as="select"
              value={layerFilter}
              onChange={onLayerFilterChanged}
            >
              {allLayers.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </FormControl>
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="elementTypeFilter">
            <Form.Label>Element Type Filter</Form.Label>
            <FormControl
              as="select"
              value={elementTypeFilter}
              onChange={onElementTypeFilterChanged}
            >
              {elementTypesFilterElements.toArray().map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </FormControl>
            <FormControl.Feedback />
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
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="results">
            <Form.Label>
              Results <Badge>{results.size}</Badge>
            </Form.Label>
            <ListGroup>
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
            <FormControl.Feedback />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ElementPicker;
