import { List } from "immutable";
import * as React from "react";
import { Diagram, Model, Query } from "../../../archimate-model";
import QueryPicker from "./query-picker";
import QueryWizard from "./query-wizard";

export type autoLayoutToggledFunc = (
  autoLayout: boolean,
  event?: React.ChangeEvent<HTMLInputElement>,
) => void;

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
  onDiagramUpdated: (diagram: Diagram) => void;
}

const QueryTab: React.FC<IProps> = (props) => {
  const initialQuery = React.useMemo(
    () => new Query(props.model),
    [props.model],
  );

  const [queries, setQueries] = React.useState<List<Query>>(
    List([initialQuery]),
  );
  const [selectedQuery, setSelectedQuery] = React.useState<Query>(initialQuery);

  React.useEffect(() => {
    const query = new Query(props.model);
    setQueries(List([query]));
    setSelectedQuery(query);
  }, [props.model]);

  const onQuerySelected = React.useCallback((query: Query) => {
    setSelectedQuery(query);
  }, []);

  const onNewQuery = React.useCallback(() => {
    const newQuery = new Query(props.model);
    setQueries((prevQueries) => prevQueries.push(newQuery));
    setSelectedQuery(newQuery);
  }, [props.model]);

  const onQueryChanged = React.useCallback(
    (query: Query) => {
      const diagram = query.run();
      setSelectedQuery(query);
      props.onDiagramUpdated(diagram);
    },
    [props.onDiagramUpdated],
  );

  return (
    <>
      <QueryPicker
        onNewQuery={onNewQuery}
        onQuerySelected={onQuerySelected}
        queries={queries}
        selectedQuery={selectedQuery}
      />
      <QueryWizard
        model={props.model}
        selectedDiagram={props.selectedDiagram}
        query={selectedQuery}
        onQueryChanged={onQueryChanged}
      />
    </>
  );
};

export default QueryTab;
