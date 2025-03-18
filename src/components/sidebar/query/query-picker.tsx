import { List } from "immutable";
import * as React from "react";
import {
  Accordion,
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup
} from "react-bootstrap";
import { Query } from "../../../archimate-model";

interface IProps {
  onNewQuery: () => void;
  onQuerySelected: (query: Query) => void;
  queries: List<Query>;
  selectedQuery: Query;
}

export default class QueryTab extends React.PureComponent<IProps> {
  public render() {
    return (
      <Accordion defaultActiveKey="">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Queries</Accordion.Header>
          <Accordion.Body>
            <Form>
              <FormGroup controlId="queryDiagramSelector">
                <InputGroup>
                  <FormControl
                    as="select"
                    placeholder="Select Query"
                    defaultValue={this.props.selectedQuery.name}
                    onChange={this.onQuerySelected}
                  >
                    {this.props.queries.toArray().map(
                      q =>
                        q ? (
                          <option key={q.id} value={q.id}>
                            {q.name}
                          </option>
                        ) : (
                          undefined
                        )
                    )}
                  </FormControl>
                  <FormControl.Feedback />
                  <Button onClick={this.props.onNewQuery}>
                    New
                  </Button>
                </InputGroup>
                <Form.Text muted>
                  Select an existing query, or create a new one.
                </Form.Text>
              </FormGroup>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

  private onQuerySelected = (event: any) => {
    const queryId = event.target.value;
    const query = this.props.queries.find(q => (q ? q.id === queryId : false));
    if (!query) {
      return; // Early return if query not found to avoid passing undefined
    }
    this.props.onQuerySelected(query);
  };
}
