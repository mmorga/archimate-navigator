import Fuse, { FuseResult } from "fuse.js";
import * as React from "react";
import {
  Button,
  Card,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
} from "react-bootstrap";
import { IEntity, Model } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import SearchResult from "./search-result";

export default function SearchTab({
  model,
  resultClicked,
  searchText,
}: {
  model: Model | undefined;
  resultClicked: entityClickedFunc;
  searchText?: string;
}) {
  const [fuse, setFuse] = React.useState<Fuse<IEntity> | null>(null);
  const [results, setResults] = React.useState<FuseResult<IEntity>[]>([]);
  const [search, setSearch] = React.useState(searchText || "");

  const fuseOptions = {
    distance: 100,
    keys: ["name", "type", "documentation", "properties"],
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.6,
  };

  React.useEffect(() => {
    setFuse(new Fuse<IEntity>(model ? model.entities() : [], fuseOptions));
  }, [model]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (search.length > 0 && fuse) {
      setResults(fuse.search(search));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.currentTarget.value;
    setSearch(newSearch);
    if (newSearch.length > 0 && fuse) {
      setResults(fuse.search(newSearch));
    }
  };

  const maxResultIdx = results.length > 100 ? 100 : results.length;
  const disabled = fuse === null;
  const searchTitle = disabled ? "Loading" : "Search";

  const resultItems = results
    .slice(0, maxResultIdx)
    .map((result) => (
      <SearchResult
        key={result.item.id}
        entity={result.item}
        resultClicked={resultClicked}
      />
    ));

  return (
    <Card>
      <Card.Body>
        <Form>
          <FormGroup>
            <InputGroup>
              <FormControl
                id="search-input"
                type="text"
                placeholder="Search"
                defaultValue={search}
                onChange={handleChange}
              />
              <Button onClick={handleClick} disabled={disabled}>
                {searchTitle}
              </Button>
            </InputGroup>
          </FormGroup>
          <ol>{resultItems}</ol>
        </Form>
      </Card.Body>
    </Card>
  );
}
