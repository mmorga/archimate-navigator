export interface IProperty {
    readonly key: string;
    readonly value?: string;
    readonly lang?: string;
}

export default class Property {
    public readonly key: string;
    public readonly value?: string;
    public readonly lang: string;

    constructor(args: IProperty) {
        this.key = args.key;
        this.value = args.value;
        this.lang = args.lang || "en";
    }
}
