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
  diagramLinkClicked: entityClickedFunc;
  entityClicked: entityClickedFunc;
  model: Model;
  onDiagramUpdated: (diagram: Diagram) => void;
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
      <div className="archimate-view-nav"
        style={{
          flexBasis: `${this.state.sidebarWidth}px`,
        }}
      >
        <ModelInfo
          model={this.props.model}
          selectedDiagram={this.props.selectedDiagram}
        />
        <Tabs
          id="archimate-sidebar-tabs"
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
              model={this.props.model}
              selectedDiagram={this.props.selectedDiagram}
              onDiagramUpdated={this.props.onDiagramUpdated}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
