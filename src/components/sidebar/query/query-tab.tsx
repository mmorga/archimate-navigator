import {
  Diagram,
  Element,
  ElementType,
  Layer,
  Model,
  ViewpointType,
  Query,
  initQuery,
} from "../../../archimate-model";
import { List } from "immutable";
import { useCallback, useState } from "react";
import QueryPicker from "./query-picker";
import QueryWizard from "./query-wizard";

export default function QueryTab({
  model,
  query,
  selectedDiagram,
  onQueryNameChanged,
  onViewpointChanged,
  onPathDepthChanged,
  onLayerFilterChanged,
  onElementTypeFilterChanged,
  onAddElement,
  onRemoveElement,
}: {
  model: Model | undefined;
  query: Query | undefined;
  selectedDiagram: Diagram | undefined;
  onQueryNameChanged: (name: string) => void;
  onViewpointChanged: (viewpointType: ViewpointType) => void;
  onPathDepthChanged: (depth: number) => void;
  onLayerFilterChanged: (layer: Layer, checked: boolean) => void;
  onElementTypeFilterChanged: (elementType: ElementType) => void;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
}) {
  const [selectedQuery, setSelectedQuery] = useState<Query | undefined>(query);
  const [queries, setQueries] = useState<List<Query>>(
    selectedQuery ? List([selectedQuery]) : List(),
  );

  const onQuerySelected = useCallback((query: Query) => {
    setSelectedQuery(query);
  }, []);

  const onNewQuery = useCallback(() => {
    if (model) {
      const newQuery = initQuery(model);
      setQueries((prevQueries) => prevQueries.push(newQuery));
      setSelectedQuery(newQuery);
    }
  }, [model]);

  return (
    <>
      <QueryPicker
        onNewQuery={onNewQuery}
        onQuerySelected={onQuerySelected}
        queries={queries}
        selectedQuery={query}
      />
      <QueryWizard
        model={model}
        selectedDiagram={selectedDiagram}
        query={query}
        onQueryNameChanged={onQueryNameChanged}
        onViewpointChanged={onViewpointChanged}
        onPathDepthChanged={onPathDepthChanged}
        onLayerFilterChanged={onLayerFilterChanged}
        onElementTypeFilterChanged={onElementTypeFilterChanged}
        onAddElement={onAddElement}
        onRemoveElement={onRemoveElement}
      />
    </>
  );
}
