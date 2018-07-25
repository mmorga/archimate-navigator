import * as React from "react";
import { Checkbox, Panel } from 'react-bootstrap';
import { Diagram, Model } from "../../archimate-model";

export type autoLayoutToggledFunc = (autoLayout: boolean, event?: React.FormEvent<Checkbox>) => void;

interface IProps {
  model: Model;
  selectedDiagram: Diagram | undefined;
  autoLayout: boolean;
  autoLayoutToggled?: autoLayoutToggledFunc;
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
      <Panel>
        <Panel.Body>
          <form>
            <Checkbox defaultChecked={this.props.autoLayout} onChange={this.autoLayoutToggled}> Auto Layout </Checkbox>
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
        </Panel.Body>
      </Panel>
    );
  }

  private autoLayoutToggled = (event: React.FormEvent<Checkbox>) => {
    if (this.props.autoLayoutToggled) {
      this.props.autoLayoutToggled(!this.props.autoLayout, event);
    }
  }

  private runQuery = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
  };

  private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ query: event.target.value });
  };
}
