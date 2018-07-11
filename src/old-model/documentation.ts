export interface IDocumentation {
    readonly lang?: string;
    readonly text?: string;
}

export default class Documentation {
    public readonly lang: string;
    public readonly text: string;

    constructor(args: IDocumentation) {
        this.lang = args.lang || "en";
        this.text = args.text || "";
    }
}
