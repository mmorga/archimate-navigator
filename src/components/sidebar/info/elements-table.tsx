import * as React from "react";
import { Element } from "../../../archimate-model";
import { entityClickedFunc } from "../../common";
import EntityLink from "../entity-link";
import Panel from "../panel";

interface IProps {
  elements: Element[];
  elementClicked: entityClickedFunc;
}

export default class ElementsTable extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    let elementRows = [
      <tr key="no-elements">
        <td colSpan={4}>
          <p className="text-info">No elements</p>
        </td>
      </tr>
    ];

    if (this.props.elements.length > 0) {
      elementRows = this.props.elements.map(element => {
        return (
          <tr key={element.id}>
            <td>
              <EntityLink
                entity={element}
                entityClicked={this.props.elementClicked}
              />
            </td>
            <td>{element.type}</td>
          </tr>
        );
      });
    }
    const empty = this.props.elements.length === 0;
    const header = !empty ? (
      "Elements"
    ) : (
      <React.Fragment>
        Elements <span className="small">(none)</span>
      </React.Fragment>
    );
    return (
      <Panel header={header} initiallyCollapsed={empty}>
        <table className="table archimate-elements-table">
          <thead>
            <tr key="elements-header">
              <th>Element</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>{elementRows}</tbody>
        </table>
      </Panel>
    );
  }
}
