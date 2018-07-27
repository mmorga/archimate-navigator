import * as React from "react";
import {
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from "react-bootstrap";
import { Query } from "../../../archimate-model";
import CollapsibleFormGroup from "./collapsible-form-group";

interface IProps {
  query: Query;
  onQueryChanged: (query: Query) => void;
}

export default class OptionsPanel extends React.PureComponent<
  IProps
> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
        <CollapsibleFormGroup defaultExpanded={false} title="Options">
          <FormGroup>
            <ControlLabel>Path Depth</ControlLabel>
            <FormControl
                type="number"
                min="0"
                max="100"
                step="1"
                value={this.props.query.pathDepth}
                onChange={this.onPathDepthChanged}
            />
            <FormControl.Feedback />
            <HelpBlock>Maximum number of connections to include</HelpBlock>
          </FormGroup>
        </CollapsibleFormGroup>
    );
  }

  private onPathDepthChanged = (event: any) => {
    this.props.onQueryChanged(this.props.query.updateQuery({ pathDepth: Number.parseInt(event.target.value, 10) }));
  };
}
