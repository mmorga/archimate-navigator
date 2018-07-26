import Fuse from "fuse.js";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Panel
} from "react-bootstrap";
import { Model } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import SearchResult from "./search-result";

interface IProps {
  model: Model;
  resultClicked: entityClickedFunc;
  searchText?: string;
}

interface IState {
  fuse: Fuse;
  results: any[];
  search: string;
}

export default class SearchTab extends React.PureComponent<IProps, IState> {
  private fuseOptions = {
    distance: 100,
    keys: ["name", "type", "documentation", "properties"],
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.6
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      fuse: new Fuse(this.props.model.entities(), this.fuseOptions),
      results: [],
      search: this.props.searchText || ""
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (this.props.model !== nextProps.model) {
      this.setState({
        fuse: new Fuse(nextProps.model.entities(), this.fuseOptions)
      });
    }
  }

  public render() {
    const maxResultIdx =
      this.state.results.length > 100 ? 100 : this.state.results.length;
    const opts: any = {};
    let searchTitle = "Search";
    if (this.state.fuse === null) {
      opts.disabled = "disabled";
      searchTitle = "Loading";
    }
    const resultItems = this.state.results
      .slice(0, maxResultIdx)
      .map(result => (
        <SearchResult
          key={result.id}
          entity={result}
          resultClicked={this.props.resultClicked}
        />
      ));
    return (
      <Panel>
        <Panel.Body>
          <Form>
            <FormGroup>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  defaultValue={this.state.search}
                  onChange={this.handleChange}
                />
                <InputGroup.Button>
                  <Button onClick={this.handleClick} {...opts}>
                    {searchTitle}
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
            <ol>{resultItems}</ol>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }

  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.state.search.length > 0) {
      this.setState({
        results: this.state.fuse.search(this.state.search)
      });
    }
  };

  private handleChange = (event: any) => {
    this.setState({ search: event.currentTarget.value });
    if (this.state.search.length > 0) {
      this.setState({
        results: this.state.fuse.search(this.state.search)
      });
    }
  };
}
