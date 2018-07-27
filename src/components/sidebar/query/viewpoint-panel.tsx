import * as React from "react";
import {
  FormControl,
  HelpBlock
} from "react-bootstrap";
import { Query, Viewpoints } from "../../../archimate-model";
import CollapsibleFormGroup from "./collapsible-form-group";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

export default class ViewpointPanel extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <CollapsibleFormGroup
          label={this.props.query.viewpoint}
          defaultExpanded={false}
          title="Viewpoint" >
        <FormControl
          componentClass="select"
          defaultValue={this.props.query.viewpoint}
          onChange={this.onViewpointChanged}
        >
          {Viewpoints.map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </FormControl>
        <FormControl.Feedback />
        <HelpBlock>
          Filters the valid elements and relationships for the query
          results
        </HelpBlock>
      </CollapsibleFormGroup>
    );
  }

  private onViewpointChanged = (event: any) => {
    this.props.onQueryChanged(this.props.query.updateQuery({viewpoint: event.target.value}));
  };
}
