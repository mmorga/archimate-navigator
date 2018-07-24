import * as React from "react";
import { Diagram, Model } from "../../archimate-model";
import Panel from "./panel";

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
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
      query: "",
    };
  }

  public render() {
    return (
      <div>
        <Panel>
          <form className="form">
            <textarea
              className="form-control"
              rows={5}
              value={this.state.query || ""}
              onChange={this.handleChange}
              placeholder="Query"
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
      </div>
    );
  }

  private runQuery = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
  };

  private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ query: event.target.value });
  };
}
