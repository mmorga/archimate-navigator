export enum RelationshipType {
  Composition = "CompositionRelationship",
  Aggregation = "AggregationRelationship",
  Assignment = "AssignmentRelationship",
  Realization = "RealizationRelationship",
  Realisation = "RealisationRelationship",
  Serving = "ServingRelationship",
  UsedBy = "UsedByRelationship",
  Access = "AccessRelationship",
  Influence = "InfluenceRelationship",
  Triggering = "TriggeringRelationship",
  Flow = "FlowRelationship",
  Specialization = "SpecializationRelationship",
  Specialisation = "SpecialisationRelationship",
  Association = "AssociationRelationship",
  Junction = "JunctionRelationship",
  AndJunction = "AndJunctionRelationship",
  OrJunction = "OrJunctionRelationship",
}

export const RelationshipTypes = [
  RelationshipType.Composition,
  RelationshipType.Aggregation,
  RelationshipType.Assignment,
  RelationshipType.Realization,
  RelationshipType.Realisation,
  RelationshipType.Serving,
  RelationshipType.UsedBy,
  RelationshipType.Access,
  RelationshipType.Influence,
  RelationshipType.Triggering,
  RelationshipType.Flow,
  RelationshipType.Specialization,
  RelationshipType.Specialisation,
  RelationshipType.Association,
  RelationshipType.Junction,
  RelationshipType.AndJunction,
  RelationshipType.OrJunction,
];
