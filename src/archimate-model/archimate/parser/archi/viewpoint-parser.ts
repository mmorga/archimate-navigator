import { ViewpointType } from "../../viewpoint-type";
import { getStringAttribute } from "./dom-helpers";

const archiViewpointMap = new Map<string, ViewpointType | undefined>([
  ["1", undefined], // ViewpointType.Actor_cooperation,
  ["2", ViewpointType.Application_behavior],
  ["application_cooperation", ViewpointType.Application_cooperation],
  ["3", ViewpointType.Application_cooperation],
  ["4", ViewpointType.Application_structure],
  ["application_usage", ViewpointType.Application_usage],
  ["5", ViewpointType.Application_usage],
  ["6", ViewpointType.Business_function],
  ["business_process_cooperation", ViewpointType.Business_process_cooperation],
  ["7", undefined], // ViewpointType.Business_cooperation,
  ["8", ViewpointType.Business_process],
  ["product", ViewpointType.Product],
  ["9", ViewpointType.Product],
  ["implementation_deployment", ViewpointType.Implementation_and_deployment],
  ["10", ViewpointType.Implementation_and_deployment],
  ["information_structure", ViewpointType.Information_structure],
  ["11", ViewpointType.Information_structure],
  ["12", ViewpointType.Infrastructure_usage],
  ["13", ViewpointType.Infrastructure],
  ["layered", ViewpointType.Layered],
  ["14", ViewpointType.Layered],
  ["organization", ViewpointType.Organization],
  ["15", ViewpointType.Organization],
  ["service_realization", ViewpointType.Service_realization],
  ["16", ViewpointType.Service_realization],
  ["stakeholder", ViewpointType.Stakeholder],
  ["17", ViewpointType.Stakeholder],
  ["goal_realization", ViewpointType.Goal_realization],
  ["18", ViewpointType.Goal_realization],
  ["19", ViewpointType.Goal_contribution],
  ["20", ViewpointType.Principles],
  ["requirements_realization", ViewpointType.Requirements_realization],
  ["21", ViewpointType.Requirements_realization],
  ["motivation", ViewpointType.Motivation],
  ["22", ViewpointType.Motivation],
  ["project", ViewpointType.Project],
  ["23", ViewpointType.Project],
  ["migration", ViewpointType.Migration],
  ["24", ViewpointType.Migration],
  ["implementation_migration", ViewpointType.Implementation_and_migration],
  ["25", ViewpointType.Implementation_and_migration],
  ["capability", undefined], // ViewpointType.Capability,
  ["outcome_realization", ViewpointType.Outcome_realization],
  ["physical", ViewpointType.Physical],
  ["resource", undefined], // ViewpointType.Resource,
  ["strategy", ViewpointType.Strategy],
  ["technology", ViewpointType.Technology],
  ["technology_usage", ViewpointType.Technology_usage],
]);

export class ViewpointParser {
  public viewpoint(domEl: Element): ViewpointType | undefined {
    const viewpointStr = getStringAttribute(domEl, "viewpoint");
    if (viewpointStr === undefined) {
      return undefined;
    }
    return archiViewpointMap.get(viewpointStr as string);
  }
}
