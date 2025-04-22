import { Set } from "immutable";
import { ElementType, RelationshipType } from "..";
import { Element } from "./element";
import { Model } from "./model";
import {
  elementTypeFilter,
  relationshipElementTypesFilter,
  relationshipTypesFilter,
} from "./query-runner";
import { Relationship } from "./relationship";

test("elementTypeFilter", () => {
  const filter = elementTypeFilter(Set<ElementType>([ElementType.Artifact]));
  const model = new Model();

  expect(filter(undefined)).toBe(false);
  expect(filter(new Element(model, ElementType.Assessment))).toBe(false);
  expect(filter(new Element(model, ElementType.Artifact))).toBe(true);
});

test("relationshipElementTypesFilter", () => {
  const filter = relationshipElementTypesFilter(
    Set<ElementType>([
      ElementType.ApplicationComponent,
      ElementType.ApplicationInterface,
    ]),
  );
  const model = new Model();

  const appComp = new Element(model, ElementType.ApplicationComponent);
  const appIfc = new Element(model, ElementType.ApplicationInterface);
  const appSvc = new Element(model, ElementType.ApplicationService);
  model.register(appComp);
  model.register(appIfc);
  model.register(appSvc);
  expect(
    filter(
      new Relationship(
        model,
        RelationshipType.Composition,
        appComp.id,
        appIfc.id,
      ),
    ),
  ).toBe(true);
  expect(
    filter(
      new Relationship(
        model,
        RelationshipType.Composition,
        appComp.id,
        appSvc.id,
      ),
    ),
  ).toBe(false);
  expect(
    filter(
      new Relationship(model, RelationshipType.Serving, appSvc.id, appComp.id),
    ),
  ).toBe(false);
});

test("relationshipTypesFilter", () => {
  const filter = relationshipTypesFilter(
    Set<RelationshipType>([
      RelationshipType.Composition,
      RelationshipType.Serving,
    ]),
  );
  const model = new Model();

  const appComp = new Element(model, ElementType.ApplicationComponent);
  const appIfc = new Element(model, ElementType.ApplicationInterface);
  const appSvc = new Element(model, ElementType.ApplicationService);
  model.register(appComp);
  model.register(appIfc);
  model.register(appSvc);
  expect(
    filter(
      new Relationship(
        model,
        RelationshipType.Composition,
        appComp.id,
        appIfc.id,
      ),
    ),
  ).toBe(true);
  expect(
    filter(
      new Relationship(model, RelationshipType.Serving, appComp.id, appSvc.id),
    ),
  ).toBe(true);
  expect(
    filter(
      new Relationship(model, RelationshipType.Access, appSvc.id, appComp.id),
    ),
  ).toBe(false);
});
