import { useState } from "react";
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

export default function Sidebar({
  diagramLinkClicked,
  entityClicked,
  model,
  onDiagramUpdated,
  onTabSelected,
  selectedDiagram,
  selectedEntity,
  sidebarTabKey
}: IProps) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(SidebarWidth.Normal);

  const widthStyle = (width: SidebarWidth): string | undefined => {
    return sidebarWidth === width ? "primary" : undefined;
  };

  const onSizeButtonClick = (width: SidebarWidth) => {
    if (sidebarWidth !== width) {
      setSidebarWidth(width);
    }
  };

  return (
    <div
      className="archimate-view-nav"
      style={{
        flexBasis: `${sidebarWidth}px`
      }}
    >
      <ButtonGroup size="sm">
        <Button onClick={() => onSizeButtonClick(SidebarWidth.Collapsed)} variant={widthStyle(SidebarWidth.Collapsed)}><ArrowsAngleContract /></Button>
        <Button onClick={() => onSizeButtonClick(SidebarWidth.Normal)} variant={widthStyle(SidebarWidth.Normal)}><Window /></Button>
        <Button onClick={() => onSizeButtonClick(SidebarWidth.Wide)} variant={widthStyle(SidebarWidth.Wide)}><ArrowsAngleExpand /></Button>
      </ButtonGroup>
      <ModelInfo
        modelName={model.name}
        diagramName={selectedDiagram?.name}
        diagramViewpoint={selectedDiagram?.viewpointDescription()}
      />
      <Tabs
        id="archimate-sidebar-tabs"
        defaultActiveKey={SidebarTab.DiagramTreeTab}
        activeKey={sidebarTabKey}
        onSelect={onTabSelected}
      >
        <Tab eventKey={SidebarTab.DiagramTreeTab} title="Views">
          <ViewsTab
            organizations={model.viewOrganization().organizations}
            items={model.viewOrganization().itemEntities()}
            selectedEntity={selectedDiagram}
            entityClicked={diagramLinkClicked}
          />
        </Tab>
        <Tab eventKey={SidebarTab.InfoTab} title="Info">
          <InfoTab
            entity={selectedEntity}
            entityClicked={entityClicked}
          />
        </Tab>
        <Tab eventKey={SidebarTab.SearchTab} title="Search">
          <SearchTab
            model={model}
            resultClicked={entityClicked}
          />
        </Tab>
        <Tab eventKey={SidebarTab.GraphTab} title="Query">
          <QueryTab
            model={model}
            selectedDiagram={selectedDiagram}
            onDiagramUpdated={onDiagramUpdated}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
