import * as React from "react";
import Panel from "../panel";

interface IProps {
    documentation: string | undefined;
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
        return (
            <Panel header="Documentation">
                {this.props.documentation || "No Documentation" }
            </Panel>
        );
    }
}

