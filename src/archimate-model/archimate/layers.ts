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
  None = "None",
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
  Layer.None,
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
        ElementType.CapabilityElementType,
        ElementType.CourseOfActionElementType,
        ElementType.ResourceElementType,      
      ];
    case Layer.Business: 
      return [
        ElementType.BusinessActorElementType,
        ElementType.BusinessCollaborationElementType,
        ElementType.BusinessEventElementType,
        ElementType.BusinessFunctionElementType,
        ElementType.BusinessInteractionElementType,
        ElementType.BusinessInterfaceElementType,
        ElementType.BusinessObjectElementType,
        ElementType.BusinessProcessElementType,
        ElementType.BusinessRoleElementType,
        ElementType.BusinessServiceElementType,
        ElementType.ContractElementType,
        ElementType.ProductElementType,
        ElementType.RepresentationElementType,
      ];
    case Layer.Application: 
      return [
        ElementType.ApplicationCollaborationElementType,
        ElementType.ApplicationComponentElementType,
        ElementType.ApplicationEventElementType,
        ElementType.ApplicationFunctionElementType,
        ElementType.ApplicationInteractionElementType,
        ElementType.ApplicationInterfaceElementType,
        ElementType.ApplicationProcessElementType,
        ElementType.ApplicationServiceElementType,
        ElementType.DataObjectElementType,
      ];
    case Layer.Technology: 
      return [
        ElementType.ArtifactElementType,
        ElementType.CommunicationNetworkElementType,
        ElementType.CommunicationPathElementType,
        ElementType.DeviceElementType,
        ElementType.InfrastructureFunctionElementType,
        ElementType.InfrastructureInterfaceElementType,
        ElementType.InfrastructureServiceElementType,
        ElementType.NetworkElementType,
        ElementType.NodeElementType,
        ElementType.PathElementType,
        ElementType.SystemSoftwareElementType,
        ElementType.TechnologyCollaborationElementType,
        ElementType.TechnologyEventElementType,
        ElementType.TechnologyFunctionElementType,
        ElementType.TechnologyInteractionElementType,
        ElementType.TechnologyInterfaceElementType,
        ElementType.TechnologyObjectElementType,
        ElementType.TechnologyProcessElementType,
        ElementType.TechnologyServiceElementType,
      ];
    case Layer.Physical: 
      return [
        ElementType.DistributionNetworkElementType,
        ElementType.EquipmentElementType,
        ElementType.FacilityElementType,
        ElementType.MaterialElementType,
      ];
    case Layer.Motivation: 
      return [
        ElementType.AssessmentElementType,
        ElementType.ConstraintElementType,
        ElementType.DriverElementType,
        ElementType.GoalElementType,
        ElementType.MeaningElementType,
        ElementType.OutcomeElementType,
        ElementType.PrincipleElementType,
        ElementType.RequirementElementType,
        ElementType.StakeholderElementType,
        ElementType.ValueElementType,
      ];
    case Layer.ImplementationAndMigration: 
      return [
        ElementType.DeliverableElementType,
        ElementType.GapElementType,
        ElementType.ImplementationEventElementType,
        ElementType.PlateauElementType,
        ElementType.WorkPackageElementType,
      ];
    case Layer.Connectors: 
      return [
        ElementType.AndJunctionElementType,
        ElementType.JunctionElementType,
        ElementType.OrJunctionElementType,
      ];
    case Layer.Other: 
      return [
        ElementType.LocationElementType,
        ElementType.GroupingElementType,
      ];
    case Layer.None: 
    default:
      return ElementTypes;
  }
}
