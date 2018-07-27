import { List } from "immutable";
import * as React from "react";
import {
  Checkbox,
} from "react-bootstrap";
import {
  Diagram,
  Model,
  Query,
} from "../../../archimate-model";
import QueryPicker from "./query-picker";
import QuerySettings from "./query-settings";
import QueryWizard from "./query-wizard";

export type autoLayoutToggledFunc = (
  autoLayout: boolean,
  event?: React.FormEvent<Checkbox>
) => void;

interface IProps {
  autoLayout: boolean;
  model: Model;
  onAutoLayoutToggled: (autoLayout: boolean) => void,
  selectedDiagram: Diagram | undefined;
}

interface IState {
  queries: List<Query>;
  selectedQuery: Query;
}

export default class QueryTab extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    const query = new Query(this.props.model);
    this.state = {
      queries: List([query]),
      selectedQuery: query,
    };
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
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
      <React.Fragment>
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
        <QuerySettings
          autoLayout={this.props.autoLayout}
          onAutoLayoutToggled={this.props.onAutoLayoutToggled}
        />
      </React.Fragment>
    );
  }

  private onQuerySelected = (event: any /*: React.FormEvent<FormControl>*/) => {
    this.setState({ selectedQuery: event.target.value });
  };

  private onNewQuery = () => {
    const newQuery = new Query(this.props.model);
    this.setState({ 
      queries: this.state.queries.push(newQuery),
      selectedQuery: newQuery,
     });
  };

  private onQueryChanged = (query: Query) => {
    this.setState({
      selectedQuery: query,
    });
  };
}
