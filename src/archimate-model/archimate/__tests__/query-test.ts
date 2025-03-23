import { Set } from "immutable";
import { Diagram } from "../diagram";
import { Element } from "../element";
import { ElementType } from "../element-type";
import { Model } from "../model";
import { Query } from "../query";
import { Relationship } from "../relationship";
import { RelationshipType } from "../relationship-type";
import { ViewpointType } from "../viewpoint-type";

function createTestElement(model: Model): Element {
  const element = new Element(model, ElementType.ApplicationComponent);
  return element;
}

function createTestRelationship(
  model: Model,
  source: Element,
  target: Element,
): Relationship {
  const relationship = new Relationship(
    model,
    RelationshipType.Serving,
    source.id,
    target.id,
  );
  relationship.source = source.id;
  relationship.target = target.id;
  return relationship;
}

function createTestModel(): Model {
  const model = new Model();
  const element1 = createTestElement(model);
  const element2 = createTestElement(model);
  const relationship1 = createTestRelationship(model, element1, element2);
  model.elements.push(element1);
  model.elements.push(element2);
  model.relationships.push(relationship1);
  return model;
}

test("diagram", () => {
  const model = createTestModel();
  const subject = new Query(model);
  subject.viewpointType = ViewpointType.Application_cooperation;
  subject.elements = Set<Element>(model.elements);
  subject.relationships = Set<Relationship>(model.relationships);
  const result = subject.run();
  expect(result).toBeInstanceOf(Diagram);
  expect(result.name).toBe(subject.name);
  expect(result.id).toBe(subject.id);
  expect(result.viewpoint).toBe(ViewpointType.Application_cooperation);
  expect(
    result.nodes
      .map((n) => n.entityInstance())
      .every((e) => model.elements.some((el) => el === e)),
  ).toBeTruthy();
  expect(
    result.connections
      .map((c) => c.entityInstance())
      .every((r) => model.relationships.some((rel) => rel === r)),
  ).toBeTruthy();
});
