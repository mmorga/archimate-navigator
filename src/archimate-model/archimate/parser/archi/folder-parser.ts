import { IModel } from "../../interfaces";
import { Organization } from "../../organization";
import { getStringAttribute } from "./dom-helpers";

export class FolderParser {
  public model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }

  public organizations(parent: Element): Organization[] {
    const children: Element[] = Array.from(parent.children).filter(
      node => node.nodeName === "folder"
    );
    if (children === undefined) {
      return [];
    }
    return children.map(this.createOrganization, this);
  }

  private createOrganization = (child: Element): Organization => {
    const organization = new Organization(this.model);
    organization.id = getStringAttribute(child, "id") || "noid"; // this.model.makeUniqueId();
    organization.name = getStringAttribute(child, "name");
    organization.type = getStringAttribute(child, "type") || "";
    organization.items = Array.from(child.children)
      .filter(node => node.nodeName === "element")
      .map(el => el.attributes.getNamedItem("id")!.value);
    organization.organizations = this.organizations(child);
    return organization;
  }
}
