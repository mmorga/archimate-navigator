import * as React from "react";
import { IDiagram, IEntity } from "../../../archimate-model";
import EntityLink from "../entity-link";
import Panel from "../panel";

interface IProps {
  views: IDiagram[];
  entityClicked: (entity: IEntity) => void;
}

export default class ViewsTable extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const views = this.props.views ? this.props.views : [];
    let tableRows = null;
    if (views.length === 0) {
      tableRows = [
        <tr key={"views-table-no-views"}>
          <td colSpan={2}>No Views</td>
        </tr>
      ];
    } else {
      tableRows = views.map(view => (
        <tr key={view.path}>
          <td>
            <EntityLink
              entity={view}
              entityClicked={this.props.entityClicked}
            />
          </td>
          <td>{view.viewpoint}</td>
        </tr>
      ));
    }

    return (
      <Panel header="Views">
        <table className="table archimate-views-table">
          <thead>
            <tr key="views-table-header">
              <th>View</th>
              <th>Viewpoint</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </Panel>
    );
  }
}