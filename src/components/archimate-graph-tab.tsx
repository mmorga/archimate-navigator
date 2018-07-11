import * as React from "react";
import CypherQuery from "../graph/cypher-query";
import Panel from "./panel";
import QueryItem from "./query-item";

interface IProps {
    query?: string;
    sampleQueries: CypherQuery[];
    results: any[];
    runQuery: (query: string) => void;
}

interface IState {
    query: string;
}

export default class ArchimateGraph extends React.PureComponent<IProps, IState> {
    public state : IState;

    constructor(props: IProps) {
        super(props);
        this.state = {
            query: this.props.query || "",
        };
    }

    public render() {
        const samples = (!this.props.sampleQueries) ? null : this.props.sampleQueries.map((q) => (
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
                            style={{width: "100%"}}
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
                    <ul>
                        {samples}
                    </ul>
                </Panel>
            </div>
        );
    }

    private loadSample = (query: CypherQuery) => {
        this.setState({query: query.query});
    }

    private runQuery = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        if (this.props.runQuery) {
            this.props.runQuery(this.state.query);
        }
    }

    private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({query: event.target.value});
    }
}
