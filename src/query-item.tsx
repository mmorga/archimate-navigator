import * as React from "react";
import CypherQuery from "./cypher-query";

interface IProps {
    query: CypherQuery;
    queryClicked: (q: CypherQuery) => void;
}

export default class QueryItem extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <li>
                <a onClick={this.handleClick}>
                    {this.props.query.name}
                </a>
            </li>
        );
    }

    private handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (this.props.queryClicked) {
            this.props.queryClicked(this.props.query);
        }
    }
}
