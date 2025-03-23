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

interface IState {
  autoLayout: boolean;
  queries: List<Query>;
  selectedQuery: Query;
}

export default class QueryTab extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const query = new Query(this.props.model);
    this.state = {
      autoLayout: true,
      queries: List([query]),
      selectedQuery: query,
    };
  }

  public componentDidUpdate(prevProps: IProps, _prevState: IState) {
    if (prevProps.model !== this.props.model) {
      const query = new Query(this.props.model);
      this.setState({
        queries: List([query]),
        selectedQuery: query,
      });
    }
  }

  public render() {
    return (
      <>
        <QueryPicker
          onNewQuery={this.onNewQuery}
          onQuerySelected={this.onQuerySelected}
          queries={this.state.queries}
          selectedQuery={this.state.selectedQuery}
        />
        <QueryWizard
          model={this.props.model}
          selectedDiagram={this.props.selectedDiagram}
          query={this.state.selectedQuery}
          onQueryChanged={this.onQueryChanged}
        />
      </>
    );
  }

  private onQuerySelected = (event: any /*: React.FormEvent<FormControl>*/) => {
    const query = event.target.value as Query;
    this.setState({ selectedQuery: query });
  };

  private onNewQuery = () => {
    const newQuery = new Query(this.props.model);
    this.setState({
      queries: this.state.queries.push(newQuery),
      selectedQuery: newQuery,
    });
  };

  private onQueryChanged = (query: Query) => {
    const diagram = query.run();
    this.setState({
      selectedQuery: query,
    });
    this.props.onDiagramUpdated(diagram);
  };
}
