import { is, Set } from "immutable";
import {
  ConnectorElementTypes,
  CoreElementTypes,
  ElementType,
  ElementTypes
} from "./element-type";

export enum ViewpointType {
  Total = "Total",
  Introductory = "Introductory",
  Organization = "Organization",
  Application_platform = "Application platform",
  Information_structure = "Information structure",
  Technology = "Technology",
  Layered = "Layered",
  Physical = "Physical",
  Product = "Product",
  Application_usage = "Application usage",
  Technology_usage = "Technology usage",
  Business_process_cooperation = "Business process cooperation",
  Application_cooperation = "Application cooperation",
  Service_realization = "Service realization",
  Implementation_and_deployment = "Implementation and deployment",
  Goal_realization = "Goal realization",
  Goal_contribution = "Goal contribution",
  Principles = "Principles",
  Requirements_realization = "Requirements realization",
  Motivation = "Motivation",
  Strategy = "Strategy",
  Capability_map = "Capability map",
  Outcome_realization = "Outcome realization",
  Resource_map = "Resource map",
  Project = "Project",
  Migration = "Migration",
  Implementation_and_migration = "Implementation and migration",
  Stakeholder = "Stakeholder",
  Actor_cooperation = "Actor cooperation",
  Business_function = "Business function",
  Business_process = "Business process",
  Application_behavior = "Application behavior",
  Application_structure = "Application structure",
  Infrastructure = "Infrastructure",
  Infrastructure_usage = "Infrastructure usage",
  Landscape_map = "Landscape map",
  Custom = "Custom"
}

export const Viewpoints: Readonly<ViewpointType[]> = [
  ViewpointType.Total,
  ViewpointType.Introductory,
  ViewpointType.Organization,
  ViewpointType.Application_platform,
  ViewpointType.Information_structure,
  ViewpointType.Technology,
  ViewpointType.Layered,
  ViewpointType.Physical,
  ViewpointType.Product,
  ViewpointType.Application_usage,
  ViewpointType.Technology_usage,
  ViewpointType.Business_process_cooperation,
  ViewpointType.Application_cooperation,
  ViewpointType.Service_realization,
  ViewpointType.Implementation_and_deployment,
  ViewpointType.Goal_realization,
  ViewpointType.Goal_contribution,
  ViewpointType.Principles,
  ViewpointType.Requirements_realization,
  ViewpointType.Motivation,
  ViewpointType.Strategy,
  ViewpointType.Capability_map,
  ViewpointType.Outcome_realization,
  ViewpointType.Resource_map,
  ViewpointType.Project,
  ViewpointType.Migration,
  ViewpointType.Implementation_and_migration,
  ViewpointType.Stakeholder,
  ViewpointType.Actor_cooperation,
  ViewpointType.Business_function,
  ViewpointType.Business_process,
  ViewpointType.Application_behavior,
  ViewpointType.Application_structure,
  ViewpointType.Infrastructure,
  ViewpointType.Infrastructure_usage,
  ViewpointType.Landscape_map,
  ViewpointType.Custom
];

export const ViewpointTypeElementTypes = new Map<
  ViewpointType,
  Readonly<ElementType[]>
>([
  [
    ViewpointType.Actor_cooperation,
    ConnectorElementTypes.concat(
      ElementType.ApplicationComponent,
      ElementType.ApplicationInterface,
      ElementType.ApplicationService,
      ElementType.BusinessActor,
      ElementType.BusinessCollaboration,
      ElementType.BusinessInterface,
      ElementType.BusinessRole,
      ElementType.BusinessService
    )
  ],
  [
    ViewpointType.Application_behavior,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationFunction,
      ElementType.ApplicationInteraction,
      ElementType.ApplicationInterface,
      ElementType.ApplicationService,
      ElementType.DataObject
    )
  ],
  [
    ViewpointType.Application_cooperation,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationFunction,
      ElementType.ApplicationInteraction,
      ElementType.ApplicationInterface,
      ElementType.ApplicationService,
      ElementType.DataObject,
      ElementType.Location
    )
  ],
  [ViewpointType.Application_platform, CoreElementTypes],
  [
    ViewpointType.Application_structure,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationInterface,
      ElementType.DataObject
    )
  ],
  [
    ViewpointType.Application_usage,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationInterface,
      ElementType.ApplicationService,
      ElementType.BusinessEvent,
      ElementType.BusinessFunction,
      ElementType.BusinessInteraction,
      ElementType.BusinessObject,
      ElementType.BusinessProcess,
      ElementType.BusinessRole,
      ElementType.DataObject
    )
  ],
  [
    ViewpointType.Business_function,
    ConnectorElementTypes.concat(
      ElementType.BusinessActor,
      ElementType.BusinessFunction,
      ElementType.BusinessRole
    )
  ],
  [
    ViewpointType.Business_process,
    ConnectorElementTypes.concat(
      ElementType.ApplicationService,
      ElementType.BusinessActor,
      ElementType.BusinessCollaboration,
      ElementType.BusinessEvent,
      ElementType.BusinessFunction,
      ElementType.BusinessInteraction,
      ElementType.BusinessObject,
      ElementType.BusinessProcess,
      ElementType.BusinessRole,
      ElementType.BusinessService,
      ElementType.Location,
      ElementType.Representation
    )
  ],
  [
    ViewpointType.Business_process_cooperation,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationEvent,
      ElementType.ApplicationFunction,
      ElementType.ApplicationInteraction,
      ElementType.ApplicationInterface,
      ElementType.ApplicationProcess,
      ElementType.ApplicationService,
      ElementType.BusinessActor,
      ElementType.BusinessCollaboration,
      ElementType.BusinessEvent,
      ElementType.BusinessFunction,
      ElementType.BusinessInteraction,
      ElementType.BusinessInterface,
      ElementType.BusinessObject,
      ElementType.BusinessProcess,
      ElementType.BusinessRole,
      ElementType.BusinessService,
      ElementType.DataObject,
      ElementType.Location,
      ElementType.Representation
    )
  ],
  [ViewpointType.Capability_map, CoreElementTypes],
  [
    ViewpointType.Goal_contribution,
    [
      ElementType.Constraint,
      ElementType.Goal,
      ElementType.Principle,
      ElementType.Requirement
    ]
  ],
  [
    ViewpointType.Goal_realization,
    [
      ElementType.Constraint,
      ElementType.Goal,
      ElementType.Principle,
      ElementType.Requirement
    ]
  ],
  [
    ViewpointType.Implementation_and_deployment,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.Artifact,
      ElementType.CommunicationPath,
      ElementType.DataObject,
      ElementType.Device,
      ElementType.InfrastructureService,
      ElementType.Network,
      ElementType.Node,
      ElementType.SystemSoftware
    )
  ],
  [
    ViewpointType.Implementation_and_migration,
    CoreElementTypes.concat(
      ConnectorElementTypes,
      ElementType.Location,
      ElementType.Requirement,
      ElementType.Constraint,
      ElementType.Goal,
      ElementType.BusinessRole,
      ElementType.WorkPackage,
      ElementType.Deliverable,
      ElementType.BusinessActor,
      ElementType.Plateau,
      ElementType.Gap
    )
  ],
  [
    ViewpointType.Information_structure,
    ConnectorElementTypes.concat(
      ElementType.Artifact,
      ElementType.BusinessObject,
      ElementType.DataObject,
      ElementType.Meaning,
      ElementType.Representation
    )
  ],
  [
    ViewpointType.Infrastructure_usage,
    ConnectorElementTypes.concat(
      ElementType.ApplicationComponent,
      ElementType.ApplicationFunction,
      ElementType.CommunicationPath,
      ElementType.Device,
      ElementType.InfrastructureFunction,
      ElementType.InfrastructureInterface,
      ElementType.InfrastructureService,
      ElementType.Network,
      ElementType.Node,
      ElementType.SystemSoftware
    )
  ],
  [
    ViewpointType.Infrastructure,
    ConnectorElementTypes.concat(
      ElementType.Artifact,
      ElementType.CommunicationPath,
      ElementType.Device,
      ElementType.InfrastructureFunction,
      ElementType.InfrastructureInterface,
      ElementType.InfrastructureService,
      ElementType.Location,
      ElementType.Network,
      ElementType.Node,
      ElementType.SystemSoftware
    )
  ],
  [ViewpointType.Introductory, CoreElementTypes],
  [ViewpointType.Landscape_map, ElementTypes.concat(ConnectorElementTypes)],
  [ViewpointType.Layered, ElementTypes.concat(ConnectorElementTypes)],
  [
    ViewpointType.Migration,
    ConnectorElementTypes.concat(ElementType.Gap, ElementType.Plateau)
  ],
  [
    ViewpointType.Motivation,
    [
      ElementType.Assessment,
      ElementType.Constraint,
      ElementType.Driver,
      ElementType.Goal,
      ElementType.Principle,
      ElementType.Requirement,
      ElementType.Stakeholder
    ]
  ],
  [
    ViewpointType.Organization,
    ConnectorElementTypes.concat(
      ElementType.BusinessActor,
      ElementType.BusinessCollaboration,
      ElementType.BusinessInterface,
      ElementType.BusinessRole,
      ElementType.Location
    )
  ],
  [ViewpointType.Outcome_realization, CoreElementTypes],
  [ViewpointType.Physical, CoreElementTypes],
  [ViewpointType.Principles, [ElementType.Goal, ElementType.Principle]],
  [
    ViewpointType.Product,
    ConnectorElementTypes.concat(
      ElementType.ApplicationComponent,
      ElementType.ApplicationInterface,
      ElementType.ApplicationService,
      ElementType.BusinessActor,
      ElementType.BusinessEvent,
      ElementType.BusinessFunction,
      ElementType.BusinessInteraction,
      ElementType.BusinessInterface,
      ElementType.BusinessProcess,
      ElementType.BusinessRole,
      ElementType.BusinessService,
      ElementType.Contract,
      ElementType.Product,
      ElementType.Value
    )
  ],
  [
    ViewpointType.Project,
    ConnectorElementTypes.concat(
      ElementType.BusinessActor,
      ElementType.BusinessRole,
      ElementType.Deliverable,
      ElementType.Goal,
      ElementType.WorkPackage
    )
  ],
  [
    ViewpointType.Requirements_realization,
    CoreElementTypes.concat(
      ConnectorElementTypes,
      ElementType.Constraint,
      ElementType.Goal,
      ElementType.Requirement
    )
  ],
  [ViewpointType.Resource_map, CoreElementTypes],
  [
    ViewpointType.Service_realization,
    ConnectorElementTypes.concat(
      ElementType.ApplicationCollaboration,
      ElementType.ApplicationComponent,
      ElementType.ApplicationService,
      ElementType.BusinessActor,
      ElementType.BusinessCollaboration,
      ElementType.BusinessEvent,
      ElementType.BusinessFunction,
      ElementType.BusinessInteraction,
      ElementType.BusinessObject,
      ElementType.BusinessProcess,
      ElementType.BusinessRole,
      ElementType.BusinessService,
      ElementType.DataObject
    )
  ],
  [
    ViewpointType.Stakeholder,
    [
      ElementType.Assessment,
      ElementType.Driver,
      ElementType.Goal,
      ElementType.Stakeholder
    ]
  ],
  [ViewpointType.Strategy, CoreElementTypes],
  [ViewpointType.Technology_usage, CoreElementTypes],
  [ViewpointType.Technology, CoreElementTypes],
  [ViewpointType.Total, ElementTypes]
]);

export function viewpointForElementTypes(
  elementTypes: Set<ElementType>
): ViewpointType {
  let viewpoint = ViewpointType.Custom;
  ViewpointTypeElementTypes.forEach(
    (value: Readonly<ElementType[]>, key: ViewpointType) => {
      if (is(elementTypes, Set<ElementType>(value))) {
        viewpoint = key;
      }
    }
  );
  return viewpoint;
}

export function elementTypesForViewpoint(
  viewpointType: ViewpointType,
  currentElementTypes: Set<ElementType>
): Set<ElementType> {
  if (viewpointType === ViewpointType.Custom) {
    return currentElementTypes;
  } else {
    const elementTypes = ViewpointTypeElementTypes.get(viewpointType);
    if (elementTypes === undefined) {
      return currentElementTypes;
    } else {
      return Set<ElementType>(elementTypes);
    }
  }
}
