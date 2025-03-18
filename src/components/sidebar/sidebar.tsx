import * as React from "react";
import { Button, ButtonGroup, Tab, Tabs } from "react-bootstrap";
import { ArrowsAngleContract, Window, ArrowsAngleExpand } from "react-bootstrap-icons";
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

export enum SidebarWidth {
  Normal = 385,
  Collapsed = 115,
  Wide = 600,
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
      sidebarWidth: SidebarWidth.Normal,
    };
  }

  public render() {
    return (
      <div
        className="archimate-view-nav"
        style={{
          flexBasis: `${this.state.sidebarWidth}px`
        }}
      >
        <ButtonGroup size="sm">
          <Button onClick={this.onSizeButtonClick.bind(this, SidebarWidth.Collapsed)} variant={this.widthStyle(SidebarWidth.Collapsed)}><ArrowsAngleContract /></Button>
          <Button onClick={this.onSizeButtonClick.bind(this, SidebarWidth.Normal)} variant={this.widthStyle(SidebarWidth.Normal)}><Window /></Button>
          <Button onClick={this.onSizeButtonClick.bind(this, SidebarWidth.Wide)} variant={this.widthStyle(SidebarWidth.Wide)}><ArrowsAngleExpand /></Button>
        </ButtonGroup>
        <ModelInfo
          modelName={this.props.model.name}
          diagramName={
            this.props.selectedDiagram
              ? this.props.selectedDiagram.name
              : undefined
          }
          diagramViewpoint={
            this.props.selectedDiagram
              ? this.props.selectedDiagram.viewpointDescription()
              : undefined
          }
        />
        <Tabs
          id="archimate-sidebar-tabs"
          defaultActiveKey={SidebarTab.DiagramTreeTab}
          activeKey={this.props.sidebarTabKey}
          onSelect={this.props.onTabSelected}
        >
          <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
            <ViewsTab
              organizations={this.props.model.viewOrganization().organizations}
              items={this.props.model.viewOrganization().itemEntities()}
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

  private widthStyle(width: SidebarWidth): string | undefined {
    return (this.state.sidebarWidth === width ? "primary" : undefined);
  }

  private onSizeButtonClick(width: SidebarWidth) {
    if (this.state.sidebarWidth !== width) {
      this.setState({sidebarWidth: width});
    }
  }
}
