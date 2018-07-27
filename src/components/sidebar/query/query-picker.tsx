import { List } from "immutable";
import * as React from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup,
  Panel,
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
      <Panel defaultExpanded={true}>
        <Panel.Heading>
          <Panel.Title componentClass="h3" toggle={true}>Queries</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Form>
              <FormGroup controlId="queryDiagramSelector">
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
                    <Button>New</Button>
                  </InputGroup.Button>
                </InputGroup>
                <HelpBlock>
                  Select an existing query, or create a new one.
                </HelpBlock>
              </FormGroup>
            </Form>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }

  private onQuerySelected = (event: any) => {
    const queryId = event.target.value;
    const query = this.props.queries.find(q => q ? q.id === queryId : false);
    this.props.onQuerySelected(query);
  };
}
