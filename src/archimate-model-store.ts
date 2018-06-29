import Model from "./archimate-model";
import {IEntity} from "./entity";
import {IFolder} from "./folder";

export interface IData {
    entities: IEntity[];
    folders: IFolder[];
}

export type StoreCallback = (store: Model) => void;

export default class ArchimateModelStore {
    private data?: IData;  // This is the raw data from the service
    private req?: XMLHttpRequest;
    private callback: StoreCallback;

    constructor(callback: StoreCallback) {
        this.data = undefined;
        this.req = undefined;
        this.callback = callback;
        this.requestData();
    }

    private requestData() {
        this.req = new XMLHttpRequest();
        this.req.addEventListener<"load">("load", this.dataLoaded);
        this.req.addEventListener<"error">("error", this.dataError);
        this.req.open("GET", "index.json", true);
        this.req.send();
    }

    private dataLoaded = (evt: Event): void => {
        this.data = JSON.parse(this.req!.responseText);
        this.callback(new Model(this.data!.entities, this.data!.folders));
    }

    private dataError = (evt: ErrorEvent) => {
        alert("Unable to load search index");
    }
}
