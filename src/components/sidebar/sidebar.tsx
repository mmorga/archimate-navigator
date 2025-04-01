import "./sidebar.css";
import { Diagram, IEntity, Model, Query } from "../../archimate-model";
import { entityClickedFunc } from "../common";
import { Tab, Tabs } from "react-bootstrap";
import InfoTab from "./info/info-tab";
import ModelInfo from "./model-info";
import QueryTab from "./query/query-tab";
import SearchTab from "./search/search-tab";
import ViewsTab from "./views/views-tab";

export enum SidebarTab {
  DiagramTreeTab = 1,
  InfoTab,
  SearchTab,
  GraphTab,
}

export default function Sidebar({
  diagramLinkClicked,
  entityClicked,
  model,
  query,
  onDiagramUpdated,
  onTabSelected,
  selectedDiagram,
  selectedEntity,
  sidebarTabKey,
}: {
  diagramLinkClicked: entityClickedFunc;
  entityClicked: entityClickedFunc;
  model: Model | undefined;
  query: Query | undefined;
  onDiagramUpdated: (diagram: Diagram) => void;
  onTabSelected: (eventKey: string | null) => void;
  selectedDiagram?: Diagram;
  selectedEntity?: IEntity;
  sidebarTabKey: SidebarTab;
}) {
  return (
    <div className="archimate-view-nav">
      <ModelInfo
        modelName={model?.name}
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
            organizations={model ? model.viewOrganization().organizations : []}
            items={model ? model.viewOrganization().itemEntities() : []}
            selectedEntity={selectedDiagram}
            entityClicked={diagramLinkClicked}
          />
        </Tab>
        <Tab eventKey={SidebarTab.InfoTab} title="Info">
          <InfoTab entity={selectedEntity} entityClicked={entityClicked} />
        </Tab>
        <Tab eventKey={SidebarTab.SearchTab} title="Search">
          <SearchTab model={model} resultClicked={entityClicked} />
        </Tab>
        <Tab eventKey={SidebarTab.GraphTab} title="Query">
          <QueryTab
            model={model}
            query={query}
            selectedDiagram={selectedDiagram}
            onDiagramUpdated={onDiagramUpdated}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
