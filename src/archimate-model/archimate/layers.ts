import { ElementType, ElementTypes } from "./element-type";

export enum Layer {
  Strategy = "Strategy",
  Business = "Business",
  Application = "Application",
  Technology = "Technology",
  Physical = "Physical",
  Motivation = "Motivation",
  ImplementationAndMigration = "Implementation And Migration",
  Connectors = "Connectors",
  Other = "Other",
  None = "None"
}

export const Layers: Layer[] = [
  Layer.Strategy,
  Layer.Business,
  Layer.Application,
  Layer.Technology,
  Layer.Physical,
  Layer.Motivation,
  Layer.ImplementationAndMigration,
  Layer.Connectors,
  Layer.Other,
  Layer.None
];

export function layerClassName(layer: Layer) {
  switch (layer) {
    case Layer.Strategy:
      return "archimate-strategy-background";
    case Layer.Business:
      return "archimate-business-background";
    case Layer.Application:
      return "archimate-application-background";
    case Layer.Technology:
      return "archimate-infrastructure-background";
    case Layer.Physical:
      return "archimate-physical-background";
    case Layer.Motivation:
      return "archimate-motivation-background";
    case Layer.ImplementationAndMigration:
      return "archimate-implementation-background";
    case Layer.Connectors:
      return "archimate-connectors-background";
    case Layer.Other:
      return "archimate-other-background";
    case Layer.None:
    default:
      return "archimate-none-background";
  }
}

export function layerElements(layer: Layer) {
  switch (layer) {
    case Layer.Strategy:
      return [
        ElementType.Capability,
        ElementType.CourseOfAction,
        ElementType.Resource
      ];
    case Layer.Business:
      return [
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
        ElementType.Contract,
        ElementType.Product,
        ElementType.Representation
      ];
    case Layer.Application:
      return [
        ElementType.ApplicationCollaboration,
        ElementType.ApplicationComponent,
        ElementType.ApplicationEvent,
        ElementType.ApplicationFunction,
        ElementType.ApplicationInteraction,
        ElementType.ApplicationInterface,
        ElementType.ApplicationProcess,
        ElementType.ApplicationService,
        ElementType.DataObject
      ];
    case Layer.Technology:
      return [
        ElementType.Artifact,
        ElementType.CommunicationNetwork,
        ElementType.CommunicationPath,
        ElementType.Device,
        ElementType.InfrastructureFunction,
        ElementType.InfrastructureInterface,
        ElementType.InfrastructureService,
        ElementType.Network,
        ElementType.Node,
        ElementType.Path,
        ElementType.SystemSoftware,
        ElementType.TechnologyCollaboration,
        ElementType.TechnologyEvent,
        ElementType.TechnologyFunction,
        ElementType.TechnologyInteraction,
        ElementType.TechnologyInterface,
        ElementType.TechnologyObject,
        ElementType.TechnologyProcess,
        ElementType.TechnologyService
      ];
    case Layer.Physical:
      return [
        ElementType.DistributionNetwork,
        ElementType.Equipment,
        ElementType.Facility,
        ElementType.Material
      ];
    case Layer.Motivation:
      return [
        ElementType.Assessment,
        ElementType.Constraint,
        ElementType.Driver,
        ElementType.Goal,
        ElementType.Meaning,
        ElementType.Outcome,
        ElementType.Principle,
        ElementType.Requirement,
        ElementType.Stakeholder,
        ElementType.Value
      ];
    case Layer.ImplementationAndMigration:
      return [
        ElementType.Deliverable,
        ElementType.Gap,
        ElementType.ImplementationEvent,
        ElementType.Plateau,
        ElementType.WorkPackage
      ];
    case Layer.Connectors:
      return [
        ElementType.AndJunction,
        ElementType.Junction,
        ElementType.OrJunction
      ];
    case Layer.Other:
      return [ElementType.Location, ElementType.Grouping];
    case Layer.None:
    default:
      return ElementTypes;
  }
}
