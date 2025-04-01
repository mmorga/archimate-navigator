import { Diagram, Model, Query } from "../../../archimate-model";
import { List } from "immutable";
import * as React from "react";
import QueryPicker from "./query-picker";
import QueryWizard from "./query-wizard";

export type autoLayoutToggledFunc = (
  autoLayout: boolean,
  event?: React.ChangeEvent<HTMLInputElement>,
) => void;

export default function QueryTab({
  model,
  query,
  selectedDiagram,
  onDiagramUpdated,
}: {
  model: Model | undefined;
  query: Query | undefined;
  selectedDiagram: Diagram | undefined;
  onDiagramUpdated: (diagram: Diagram) => void;
}) {
  const [selectedQuery, setSelectedQuery] = React.useState<Query | undefined>(
    query,
  );
  const [queries, setQueries] = React.useState<List<Query>>(
    selectedQuery ? List([selectedQuery]) : List(),
  );

  const onQuerySelected = React.useCallback((query: Query) => {
    setSelectedQuery(query);
  }, []);

  const onNewQuery = React.useCallback(() => {
    if (model) {
      const newQuery = new Query(model);
      setQueries((prevQueries) => prevQueries.push(newQuery));
      setSelectedQuery(newQuery);
    }
  }, [model]);

  const onQueryChanged = React.useCallback(
    (query: Query) => {
      const diagram = query.run();
      setSelectedQuery(query);
      onDiagramUpdated(diagram);
    },
    [onDiagramUpdated],
  );

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
        onQueryChanged={onQueryChanged}
      />
    </>
  );
}
