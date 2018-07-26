import { List } from "immutable";
import * as React from "react";
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup,
  Panel
} from "react-bootstrap";
import {
  IQuery,
} from "../../../archimate-model";

interface IProps {
  onNewQuery: () => void;
  onQuerySelected: (query: IQuery) => void;
  queries: List<IQuery>;
  selectedQuery: IQuery;
}

export default class QueryTab extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel>
        <Panel.Heading>
          Queries
        </Panel.Heading>
        <Panel.Body>
          <Form>
            <FormGroup controlId="queryDiagramSelector">
              <ControlLabel>Queries</ControlLabel>
              <InputGroup>
                <FormControl
                  componentClass="select"
                  placeholder="Select Query"
                  defaultValue={this.props.selectedQuery.name}
                  onChange={this.onQuerySelected}
                >
                  {this.props.queries.map(q => (q ?
                    <option
                      key={q.id}
                      value={q.id}
                    >
                      {q.name}
                    </option> : undefined
                  ))}
                </FormControl>
                <FormControl.Feedback />
                <InputGroup.Button onClick={this.props.onNewQuery}>
                  <Button bsStyle="primary">New</Button>
                </InputGroup.Button>
              </InputGroup>
              <HelpBlock>
                Select an existing query, or create a new one.
              </HelpBlock>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }

  private onQuerySelected = (event: any) => {
    const queryId = event.target.value;
    const query = this.props.queries.find(q => q ? q.id === queryId : false);
    this.props.onQuerySelected(query);
  };
}
