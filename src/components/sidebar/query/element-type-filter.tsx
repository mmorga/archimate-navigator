import * as React from "react";
import {
  Checkbox, ControlLabel, FormGroup, Glyphicon
} from "react-bootstrap";
import { ElementType, elementTypeLayer, Query } from "../../../archimate-model";

interface IProps {
  onQueryChanged: (query: Query) => void;
  query: Query;
}

interface IState {
  filterCollapsed: boolean;
}

export default class ElementTypeFilter extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      filterCollapsed: true,
    }
  }

  public render() {
    return (
      <FormGroup>
        <ControlLabel>
          Element Type Filter
          {"  "}
          <Glyphicon glyph={this.state.filterCollapsed ? "collapse-up" : "collapse-down"} onClick={this.onFilterCollapse}/>
        </ControlLabel>
        {this.state.filterCollapsed ? null : (
        <table style={{fontSize: "75%"}}>
          <thead>
            <tr>
              <td/>
              <th>Passive Structure</th>
              <th>Behavior</th>
              <th>Active Structure</th>
              <th>Motivation</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{background: "#fffead"}}>
              <th>Strategy</th>
              <td>
                { this.checkboxes(ElementType.Resource) }
              </td>
              <td>
                { this.checkboxes(ElementType.Capability, ElementType.CourseOfAction) }
              </td>
              <td/>
              <td rowSpan={6} style={{background: "#f2f2fe"}}>
                { this.checkboxes(
                  ElementType.Stakeholder,
                  ElementType.Driver,
                  ElementType.Assessment,
                  ElementType.Goal,
                  ElementType.Outcome,
                  ElementType.Principle,
                  ElementType.Requirement,
                  ElementType.Constraint,
                  ElementType.Meaning,
                  ElementType.Value
                ) } 
              </td>
            </tr>
            <tr style={{background: "#fffed0"}}>
              <th>Business</th>
              <td>
                { this.checkboxes(
                  ElementType.BusinessActor,
                  ElementType.BusinessRole,
                  ElementType.BusinessCollaboration,
                  ElementType.BusinessInterface
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.BusinessProcess,
                  ElementType.BusinessFunction,
                  ElementType.BusinessInteraction,
                  ElementType.BusinessEvent,
                  ElementType.BusinessService
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.BusinessObject,
                  ElementType.Contract,
                  ElementType.Representation
                ) 
                }
              </td>
            </tr>
            <tr style={{background: "#c5f1fe"}}>
              <th>Application</th>
              <td>
                { this.checkboxes(
                  ElementType.ApplicationComponent,
                  ElementType.ApplicationCollaboration,
                  ElementType.ApplicationInterface
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.ApplicationFunction,
                  ElementType.ApplicationInteraction,
                  ElementType.ApplicationProcess,
                  ElementType.ApplicationEvent,
                  ElementType.ApplicationService
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.DataObject
                ) 
                }
              </td>
            </tr>
            <tr style={{background: "#ccfecc"}}>
              <th>Technology</th>
              <td>
                { this.checkboxes(
                  ElementType.Node,
                  ElementType.Device,
                  ElementType.SystemSoftware,
                  ElementType.TechnologyCollaboration,
                  ElementType.TechnologyInterface,
                  ElementType.Path,
                  ElementType.CommunicationNetwork
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.TechnologyFunction,
                  ElementType.TechnologyProcess,
                  ElementType.TechnologyInteraction,
                  ElementType.TechnologyEvent,
                  ElementType.TechnologyService
                ) 
                }
              </td>
              <td>
                { this.checkboxes(
                  ElementType.TechnologyObject,
                  ElementType.Artifact
                ) 
                }
              </td>
            </tr>
            <tr style={{background: "#9cfd9d"}}>
              <th>Physical</th>
              <td>
                { this.checkboxes(
                  ElementType.Equipment,
                  ElementType.Facility,
                  ElementType.DistributionNetwork
                ) 
                }
              </td>
              <td/>
              <td>
                { this.checkboxes(
                  ElementType.Material
                ) 
                }
              </td>
            </tr>
            <tr style={{background: "#fee1e1"}}>
              <th>Implementation<br/>&amp;<br/>Migration</th>
              <td colSpan={3}>
                { this.checkboxes(
                  ElementType.WorkPackage,
                  ElementType.Deliverable,
                  ElementType.ImplementationEvent,
                  ElementType.Plateau,
                  ElementType.Gap
                ) 
                }
              </td>
            </tr>
          </tbody>
        </table>)}
      </FormGroup>
    );
  }

  private onToggle = (elementType: ElementType, event: any) => {
    // TODO: implement me
  }

  private checkboxes(...elementTypes: ElementType[]) {
    return elementTypes.map(elementType => {
      return (
        <Checkbox 
            key={elementType}
            checked={this.props.query.layerFilter.includes(elementTypeLayer(elementType)) && this.props.query.elementTypes.includes(elementType)}
            onClick={this.onToggle.bind(this, elementType)}
        >
          {elementType}
        </Checkbox>
      );
    });
  }

  private onFilterCollapse = () => {
    this.setState({filterCollapsed: !this.state.filterCollapsed});
  }
}
