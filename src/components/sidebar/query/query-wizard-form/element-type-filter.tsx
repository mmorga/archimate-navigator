import { PureComponent } from "react";
import { Form } from "react-bootstrap";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";
import {
  ElementType,
  Query,
  viewpointForElementTypes,
} from "../../../../archimate-model";

interface IProps {
  onQueryChanged: (query: Query) => void;
  query: Query;
}

interface IState {
  filterCollapsed: boolean;
}

export default class ElementTypeFilter extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      filterCollapsed: true,
    };
  }

  public render() {
    return (
      <Form.Group>
        <Form.Label>
          Element Type Filter
          {"  "}
          {this.state.filterCollapsed ? (
            <CaretUpFill onClick={this.onFilterCollapse} />
          ) : (
            <CaretDownFill onClick={this.onFilterCollapse} />
          )}
        </Form.Label>
        {this.state.filterCollapsed ? null : (
          <table style={{ fontSize: "75%" }}>
            <thead>
              <tr>
                <td />
                <th>Passive Structure</th>
                <th>Behavior</th>
                <th>Active Structure</th>
                <th>Motivation</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#fffead" }}>
                <th>Strategy</th>
                <td>{this.checkboxes(ElementType.Resource)}</td>
                <td>
                  {this.checkboxes(
                    ElementType.Capability,
                    ElementType.CourseOfAction,
                  )}
                </td>
                <td />
                <td rowSpan={6} style={{ background: "#f2f2fe" }}>
                  {this.checkboxes(
                    ElementType.Stakeholder,
                    ElementType.Driver,
                    ElementType.Assessment,
                    ElementType.Goal,
                    ElementType.Outcome,
                    ElementType.Principle,
                    ElementType.Requirement,
                    ElementType.Constraint,
                    ElementType.Meaning,
                    ElementType.Value,
                  )}
                </td>
              </tr>
              <tr style={{ background: "#fffed0" }}>
                <th>Business</th>
                <td>
                  {this.checkboxes(
                    ElementType.BusinessActor,
                    ElementType.BusinessRole,
                    ElementType.BusinessCollaboration,
                    ElementType.BusinessInterface,
                  )}
                </td>
                <td>
                  {this.checkboxes(
                    ElementType.BusinessProcess,
                    ElementType.BusinessFunction,
                    ElementType.BusinessInteraction,
                    ElementType.BusinessEvent,
                    ElementType.BusinessService,
                  )}
                </td>
                <td>
                  {this.checkboxes(
                    ElementType.BusinessObject,
                    ElementType.Contract,
                    ElementType.Representation,
                  )}
                </td>
              </tr>
              <tr style={{ background: "#c5f1fe" }}>
                <th>Application</th>
                <td>
                  {this.checkboxes(
                    ElementType.ApplicationComponent,
                    ElementType.ApplicationCollaboration,
                    ElementType.ApplicationInterface,
                  )}
                </td>
                <td>
                  {this.checkboxes(
                    ElementType.ApplicationFunction,
                    ElementType.ApplicationInteraction,
                    ElementType.ApplicationProcess,
                    ElementType.ApplicationEvent,
                    ElementType.ApplicationService,
                  )}
                </td>
                <td>{this.checkboxes(ElementType.DataObject)}</td>
              </tr>
              <tr style={{ background: "#ccfecc" }}>
                <th>Technology</th>
                <td>
                  {this.checkboxes(
                    ElementType.Node,
                    ElementType.Device,
                    ElementType.SystemSoftware,
                    ElementType.TechnologyCollaboration,
                    ElementType.TechnologyInterface,
                    ElementType.Path,
                    ElementType.CommunicationNetwork,
                  )}
                </td>
                <td>
                  {this.checkboxes(
                    ElementType.TechnologyFunction,
                    ElementType.TechnologyProcess,
                    ElementType.TechnologyInteraction,
                    ElementType.TechnologyEvent,
                    ElementType.TechnologyService,
                  )}
                </td>
                <td>
                  {this.checkboxes(
                    ElementType.TechnologyObject,
                    ElementType.Artifact,
                  )}
                </td>
              </tr>
              <tr style={{ background: "#9cfd9d" }}>
                <th>Physical</th>
                <td>
                  {this.checkboxes(
                    ElementType.Equipment,
                    ElementType.Facility,
                    ElementType.DistributionNetwork,
                  )}
                </td>
                <td />
                <td>{this.checkboxes(ElementType.Material)}</td>
              </tr>
              <tr style={{ background: "#fee1e1" }}>
                <th>
                  Implementation
                  <br />
                  &amp;
                  <br />
                  Migration
                </th>
                <td colSpan={3}>
                  {this.checkboxes(
                    ElementType.WorkPackage,
                    ElementType.Deliverable,
                    ElementType.ImplementationEvent,
                    ElementType.Plateau,
                    ElementType.Gap,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Form.Group>
    );
  }

  private onToggle = (elementType: ElementType) => {
    const elementTypes = this.props.query.elementTypes.includes(elementType)
      ? this.props.query.elementTypes.delete(elementType)
      : this.props.query.elementTypes.add(elementType);
    this.props.onQueryChanged(
      this.props.query.updateQuery({
        elementTypes,
        viewpointType: viewpointForElementTypes(elementTypes),
      }),
    );
  };

  private checkboxes(...elementTypes: ElementType[]) {
    return elementTypes.map((elementType) => {
      return (
        <Form.Check
          key={elementType}
          type="checkbox"
          checked={this.props.query.elementTypes.includes(elementType)}
          onChange={this.onToggle.bind(this, elementType)}
          label={elementType}
        />
      );
    });
  }

  private onFilterCollapse = () => {
    this.setState({ filterCollapsed: !this.state.filterCollapsed });
  };
}
