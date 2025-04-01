import { List } from "immutable";
import { ChangeEvent } from "react";
import {
  Accordion,
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
} from "react-bootstrap";
import { Query } from "../../../archimate-model";

export default function QueryPicker({
  onNewQuery,
  onQuerySelected,
  queries,
  selectedQuery,
}: {
  onNewQuery: () => void;
  onQuerySelected: (query: Query) => void;
  queries: List<Query>;
  selectedQuery: Query | undefined;
}) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const queryId = event.target.value;
    const query = queries.find((q) => (q ? q.id === queryId : false));
    if (!query) {
      return; // Early return if query not found to avoid passing undefined
    }
    onQuerySelected(query);
  };

  return (
    <Accordion defaultActiveKey="" alwaysOpen={true}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Queries</Accordion.Header>
        <Accordion.Body>
          <Form>
            <FormGroup controlId="queryDiagramSelector">
              <InputGroup>
                <FormControl
                  as="select"
                  placeholder="Select Query"
                  defaultValue={selectedQuery ? selectedQuery.name : ""}
                  onChange={onChange}
                >
                  {queries.toArray().map((q) =>
                    q ? (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ) : undefined,
                  )}
                </FormControl>
                <FormControl.Feedback />
                <Button onClick={onNewQuery}>New</Button>
              </InputGroup>
              <Form.Text muted>
                {selectedQuery === undefined
                  ? "No query is currently selected. Wait for model to load."
                  : "Select an existing query, or create a new one."}
              </Form.Text>
            </FormGroup>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
