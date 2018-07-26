import * as React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Diagram, IEntity, Model } from "../../archimate-model";
import "../archimate-navigator.css";
import { entityClickedFunc } from "../common";
import InfoTab from "./info/info-tab";
import ModelInfo from "./model-info";
import QueryTab from "./query/query-tab";
import SearchTab from "./search/search-tab";
import ViewsTab from "./views/views-tab";

export enum SidebarTab {
  DiagramTreeTab = 1,
  InfoTab,
  SearchTab,
  GraphTab
}

interface IProps {
  autoLayout: boolean;
  diagramLinkClicked: entityClickedFunc;
  entityClicked: entityClickedFunc;
  model: Model;
  onAutoLayoutToggled: (autoLayout: boolean) => void;
  onTabSelected: (eventKey: any) => void;
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  sidebarTabKey: SidebarTab;
}

interface IState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
}

export default class Sidebar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      sidebarCollapsed: false,
      sidebarWidth: 385
    };
  }

  public render() {
    return (
      <div
        className="archimate-view-nav"
        style={{
          flex: `0 0 ${this.state.sidebarWidth}px`,
          padding: "9px 15px"
        }}
      >
        <ModelInfo
          model={this.props.model}
          selectedDiagram={this.props.selectedDiagram}
        />
        <Tabs
          animation={false}
          defaultActiveKey={SidebarTab.DiagramTreeTab}
          activeKey={this.props.sidebarTabKey}
          onSelect={this.props.onTabSelected}
        >
          <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
            <ViewsTab
              organization={
                this.props.model.organizations[
                  this.props.model.organizations.length - 1
                ]
              }
              selectedEntity={this.props.selectedDiagram}
              entityClicked={this.props.diagramLinkClicked}
            />
          </Tab>
          <Tab eventKey={SidebarTab.InfoTab} title="Info">
            <InfoTab
              entity={this.props.selectedEntity}
              entityClicked={this.props.entityClicked}
            />
          </Tab>
          <Tab eventKey={SidebarTab.SearchTab} title="Search">
            <SearchTab
              model={this.props.model}
              resultClicked={this.props.entityClicked}
            />
          </Tab>
          <Tab eventKey={SidebarTab.GraphTab} title="Query">
            <QueryTab
              autoLayout={this.props.autoLayout}
              model={this.props.model}
              onAutoLayoutToggled={this.props.onAutoLayoutToggled}
              selectedDiagram={this.props.selectedDiagram}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
