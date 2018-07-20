import * as React from "react";
import CypherQuery from "../../graph/cypher-query";
import Panel from "./panel";
import QueryItem from "./query-item";

const SAMPLE_QUERIES: CypherQuery[] = [
  {
    name: "Applications that use Core",
    query: `MATCH p = (a:ApplicationComponent) <-[r*1..5]- (core:ApplicationComponent {name: "Core"})
             WHERE all(x IN rels(p)
             WHERE x.weight >= 6) AND
                   size(filter(n in nodes(p) where n:ApplicationComponent)) < 3
             return a, r, core`
  },
  {
    name: "Anything that uses Core or Core Interfaces",
    query: `MATCH p = (core:ApplicationComponent {name: "Core"})-[r:CompositionRelationship]->
                 (interface:ApplicationInterface)-[r2:UsedByRelationship]->()
                 RETURN p
             UNION
                 MATCH p=(core:ApplicationComponent {name: "Core"})-[r2:UsedByRelationship]->()
             return p;`
  }
];


interface IProps {
  query?: string;
  results: any[];
  runQuery: (query: string) => void;
}

interface IState {
  query: string;
}

export default class ArchimateGraph extends React.PureComponent<
  IProps,
  IState
> {
  public state: IState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      query: this.props.query || ""
    };
  }

  public render() {
    const samples = !SAMPLE_QUERIES
      ? null
      : SAMPLE_QUERIES.map(q => (
          <QueryItem key={q.name} query={q} queryClicked={this.loadSample} />
        ));
    return (
      <div>
        <Panel>
          <form className="form">
            <textarea
              className="form-control"
              rows={5}
              value={this.state.query || ""}
              onChange={this.handleChange}
              placeholder="Cypher query"
              style={{ width: "100%" }}
            />
            <button
              type="submit"
              className="btn btn-default pull-right"
              onClick={this.runQuery}
            >
              Query
            </button>
          </form>
        </Panel>
        <Panel header="Sample Queries">
          <ul>{samples}</ul>
        </Panel>
      </div>
    );
  }

  private loadSample = (query: CypherQuery) => {
    this.setState({ query: query.query });
  };

  private runQuery = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    if (this.props.runQuery) {
      this.props.runQuery(this.state.query);
    }
  };

  private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ query: event.target.value });
  };
}
