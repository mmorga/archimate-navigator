import { IEntity, IModel, IOrganization } from "./interfaces";
import { Property } from "./property";

export class Organization implements IOrganization {
  public id: string;
  public name?: string;
  public href?: string;
  public documentation?: string;
  public properties: Property[];
  public type: string;
  public organizations: Organization[];
  public items: string[];
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
    this.id = this.model.makeUniqueId();
    this.type = "";
    this.organizations = [];
    this.items = [];
    this.properties = [];
  }

  public item(id: string): Organization | undefined {
    return (this.model.lookup(id) as Organization);
  }

  public itemEntities(): IEntity[] {
    return this.items
      .map(itemId => this.item(itemId))
      .filter(maybeItem => maybeItem !== undefined)            
      .map(item => item as IEntity);
  }

  // public normalize(model: IModel): Folder {
  //     if (this.isNormalized()) {
  //         return this;
  //     }
  //     this.folders = this.iFolders.map((iFolder) => (new Folder(iFolder).normalize(model))).sort(this.sortByName);
  //     this.diagrams = this.diagramIds.map((id) => (model.diagram(id, 0))).sort(this.sortByName);
  //     super.normalize(model);
  //     return this;
  // }

  // private sortByName(a: any, b: any): number {
  //     return a.name.localeCompare(b.name);
  // }
}
