import { useState } from "react";
import { Collapse, Form, InputGroup, Table } from "react-bootstrap";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";
import { ElementType, Query } from "../../../../archimate-model";

export default function ElementTypeFilter({
  onChanged,
  query,
}: {
  onChanged: (elementType: ElementType) => void;
  query: Query | undefined;
}) {
  const [state, setState] = useState({ filterCollapsed: true });

  function checkboxes(...elementTypes: ElementType[]) {
    return elementTypes.map((elementType) => {
      return (
        <Form.Check
          id={`elementTypeFilter-${elementType}`}
          key={elementType}
          type="checkbox"
          checked={query ? query.elementTypes.includes(elementType) : true}
          onChange={() => onChanged(elementType)}
          label={elementType}
        />
      );
    });
  }

  function onFilterCollapse() {
    setState({ filterCollapsed: !state.filterCollapsed });
  }

  return (
    <Form.Group>
      <div className="form-label">
        Element Type Filter
        {"  "}
        {state.filterCollapsed ? (
          <CaretUpFill onClick={onFilterCollapse} />
        ) : (
          <CaretDownFill onClick={onFilterCollapse} />
        )}
      </div>
      <InputGroup>
        <Collapse in={!state.filterCollapsed}>
          <Table
            borderless={true}
            hover={true}
            size="sm"
            striped="columns"
            style={{ fontSize: "75%" }}
          >
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
                <td>{checkboxes(ElementType.Resource)}</td>
                <td>
                  {checkboxes(
                    ElementType.Capability,
                    ElementType.CourseOfAction,
                  )}
                </td>
                <td />
                <td rowSpan={6} style={{ background: "#f2f2fe" }}>
                  {checkboxes(
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
                  {checkboxes(
                    ElementType.BusinessActor,
                    ElementType.BusinessRole,
                    ElementType.BusinessCollaboration,
                    ElementType.BusinessInterface,
                  )}
                </td>
                <td>
                  {checkboxes(
                    ElementType.BusinessProcess,
                    ElementType.BusinessFunction,
                    ElementType.BusinessInteraction,
                    ElementType.BusinessEvent,
                    ElementType.BusinessService,
                  )}
                </td>
                <td>
                  {checkboxes(
                    ElementType.BusinessObject,
                    ElementType.Contract,
                    ElementType.Representation,
                  )}
                </td>
              </tr>
              <tr style={{ background: "#c5f1fe" }}>
                <th>Application</th>
                <td>
                  {checkboxes(
                    ElementType.ApplicationComponent,
                    ElementType.ApplicationCollaboration,
                    ElementType.ApplicationInterface,
                  )}
                </td>
                <td>
                  {checkboxes(
                    ElementType.ApplicationFunction,
                    ElementType.ApplicationInteraction,
                    ElementType.ApplicationProcess,
                    ElementType.ApplicationEvent,
                    ElementType.ApplicationService,
                  )}
                </td>
                <td>{checkboxes(ElementType.DataObject)}</td>
              </tr>
              <tr style={{ background: "#ccfecc" }}>
                <th>Technology</th>
                <td>
                  {checkboxes(
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
                  {checkboxes(
                    ElementType.TechnologyFunction,
                    ElementType.TechnologyProcess,
                    ElementType.TechnologyInteraction,
                    ElementType.TechnologyEvent,
                    ElementType.TechnologyService,
                  )}
                </td>
                <td>
                  {checkboxes(
                    ElementType.TechnologyObject,
                    ElementType.Artifact,
                  )}
                </td>
              </tr>
              <tr style={{ background: "#9cfd9d" }}>
                <th>Physical</th>
                <td>
                  {checkboxes(
                    ElementType.Equipment,
                    ElementType.Facility,
                    ElementType.DistributionNetwork,
                  )}
                </td>
                <td />
                <td>{checkboxes(ElementType.Material)}</td>
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
                  {checkboxes(
                    ElementType.WorkPackage,
                    ElementType.Deliverable,
                    ElementType.ImplementationEvent,
                    ElementType.Plateau,
                    ElementType.Gap,
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </Collapse>
      </InputGroup>
    </Form.Group>
  );
}
