import { List } from "immutable";
import * as React from "react";
import {
  Checkbox,
} from "react-bootstrap";
import {
  Diagram,
  Element,
  IQuery,
  LogicError,
  Model,
  Query
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

interface IState extends IQuery {
  queries: List<IQuery>;
  selectedQuery: IQuery;
}

export default class QueryTab extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    const query = new Query(this.props.model);
    this.state = {
      elements: query.elements,
      id: query.id,
      model: query.model,
      name: query.name,
      pathDepth: query.pathDepth,
      queries: List([query]),
      relationships: query.relationships,
      selectedQuery: query,
      viewpoint: query.viewpoint,
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
    if (prevState.selectedQuery !== this.state.selectedQuery) {
      // TODO: Save previous values back to old selectedQuery\
      const query = this.state.selectedQuery;
      this.setState({
        elements: query.elements,
        id: query.id,
        model: query.model,
        name: query.name,
        pathDepth: query.pathDepth,
        relationships: query.relationships,
        viewpoint: query.viewpoint,
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
          elements={this.state.elements}
          onQueryChanged={this.onQueryChanged}
          onAddElement={this.onQueryAddElement}
          onRemoveElement={this.onQueryRemoveElement}
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

  private onQueryChanged = (query: IQuery) => {
    this.setState({ selectedQuery: query });
  };

  private onQueryAddElement = (element: Element) => {
    this.state.selectedQuery.elements = this.state.selectedQuery.elements.push(element);
    this.setState({
      elements: this.state.elements.push(element)
    });
  };

  private onQueryRemoveElement = (element: Element) => {
    const prevElements = this.state.selectedQuery.elements;
    const nextElements = List<Element>(this.state.selectedQuery.elements.filter(e => e ? (e.id !== element.id) : false));
    if (prevElements === nextElements) {
      throw new LogicError("Expected Lists to be different instances");
    }
    if (prevElements.size !== (nextElements.size + 1)) {
      throw new LogicError("Expected Lists sizes to differ");
    }
    this.state.selectedQuery.elements = nextElements;
    this.setState({
      elements: nextElements,
    });
  };
}
