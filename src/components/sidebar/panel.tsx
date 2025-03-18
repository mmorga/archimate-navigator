import * as React from "react";

interface IProps {
  header?: React.ReactNode;
  initiallyCollapsed?: boolean;
  children?: React.ReactNode;
}

interface IState {
  collapse: boolean;
}

export default class Panel extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      collapse:
        this.props.initiallyCollapsed === undefined
          ? false
          : this.props.initiallyCollapsed
    };
  }

  public render() {
    const panelClsName = this.state.collapse
      ? "panel-body collapse"
      : "panel-body collapse in";
    return (
      <div className="panel panel-default">
        {this.header()}
        <div id="archimate-view-props" className={panelClsName}>
          {this.props.children}
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.initiallyCollapsed !== prevProps.initiallyCollapsed) {
      this.setState({
        collapse: this.props.initiallyCollapsed ? true : false
      });
    }
  }

  private handleCollapseExpand = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  private header() {
    if (this.props.header) {
      const iconClsName = this.state.collapse
        ? "glyphicon glyphicon-collapse-up"
        : "glyphicon glyphicon-collapse-down";
      return (
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.header}
            <button
              className="btn btn-primary btn-xs pull-right"
              type="button"
              aria-expanded={!this.state.collapse}
              onClick={this.handleCollapseExpand}
            >
              <span className={iconClsName} aria-hidden="true" />
            </button>
          </h3>
        </div>
      );
    }
    return null;
  }
}
