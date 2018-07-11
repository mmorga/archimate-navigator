import Fuse from "fuse.js";
import React from "react";
import Entity from "../old-model/entity";
import SearchResult from "./search-result";

// interface FuseResult {
//     id: string;
//     name: string;
//     type: string;
// }

interface IProps {
    data: Entity[];
    resultClicked: (entity: Entity) => void;
    searchText?: string;
}

interface IState {
    fuse?: Fuse;
    results: any[];
    search: string;
}

export default class ArchimateSearch extends React.PureComponent<IProps, IState> {
    public state: IState;

    private fuseOptions = {
        distance: 100,
        keys: [
            "name",
            "type",
            "documentation",
            "properties",
        ],
        location: 0,
        maxPatternLength: 32,
        shouldSort: true,
        threshold: 0.6,
    };

    constructor(props: IProps) {
        super(props);
        let fuse;
        if (props.data) {
            fuse = new Fuse(this.props.data, this.fuseOptions);
        }

        this.state = {
            fuse,
            results: [],
            search: "",
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({fuse: new Fuse(nextProps.data, this.fuseOptions)});
        }
    }

    public render() {
        const maxResultIdx = this.state.results.length > 100 ? 100 : this.state.results.length;
        const opts: any = {};
        let searchTitle = "Search";
        if (this.state.fuse === null) {
            opts.disabled = "disabled";
            searchTitle = "Loading";
        }
        const resultItems = this.state.results.slice(0, maxResultIdx).map((result) =>
            <SearchResult key={result.id} entity={result} resultClicked={this.props.resultClicked}/>,
        );
        return (
            <div role="tabpanel" className="tab-pane" id="archimate-search-tab-content">
                <div className="panel panel-default">
                    <div className="el-body">
                        <form className="form-inline">
                            <input
                                type="text"
                                className="form-control"
                                style={{width: "80%"}}
                                id="archimate-search-text"
                                placeholder="search"
                                onChange={this.handleChange}
                            />
                            <button
                                type="submit"
                                className="btn btn-default pull-right"
                                id="search"
                                onClick={this.handleClick}
                                {...opts}
                            >
                                {searchTitle}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div id="archimate-search-results" className="panel-body archimate-search-results">
                        <ol>{resultItems}</ol>
                    </div>
                </div>
            </div>
        );
    }

    private handleClick = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        if (this.props.searchText) {
            const results = this.state.fuse!.search(this.props.searchText as string);
            this.setState({results});
        }
    }

    private handleChange = (event: React.ChangeEvent<Element>) => {
        event.preventDefault();
        if (this.props.searchText) {
            const results = this.state.fuse!.search(this.props.searchText as string);
            this.setState({results});
        }
    }
}
