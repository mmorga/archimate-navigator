import * as React from "react";
import Documentation from "../old-model/documentation";
import Panel from "./panel";

interface IProps {
    documentation: Documentation[];
}

// function to_html(value : Documentation, index: number, array: ReadonlyArray<Documentation>) : JSX.Element {
//     return (
//         <p key={value.text}>{value.text}</p>
//        );
// }

export default class DocumentationPanel extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const documentation = (
            this.props.documentation.length > 0
                ? this.props.documentation
                : [{text: "No Documentation"}]
            ) as ReadonlyArray<Documentation>;
        // const docItems = documentation.map<JSX.Element>(to_html);
        const docItems = documentation.map<JSX.Element>(value => <p key={value.text}>{value.text}</p>);
        return (
            <Panel header="Documentation">
                {docItems}
            </Panel>
        );
    }
}

